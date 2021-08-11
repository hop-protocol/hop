import '../moduleAlias'
import BaseWatcher from './classes/BaseWatcher'
import L1Bridge from './classes/L1Bridge'
import L2Bridge from './classes/L2Bridge'
import PolygonBridgeWatcher from './PolygonBridgeWatcher'
import chalk from 'chalk'
import { Chain, TEN_MINUTES_MS, TX_RETRY_DELAY_MS } from 'src/constants'
import { Contract, providers } from 'ethers'
import { TransferRoot } from 'src/db/TransferRootsDb'
import { executeExitTx, getL2Amb } from './xDaiBridgeWatcher'

export interface Config {
  chainSlug: string
  tokenSymbol: string
  isL1: boolean
  bridgeContract: Contract
  l1BridgeContract: Contract
  label: string
  token: string
  order?: () => number
  dryMode?: boolean
}

class xDomainMessageRelayWatcher extends BaseWatcher {
  l1Bridge: L1Bridge
  lastSeen: {[key: string]: number} = {}

  constructor (config: Config) {
    super({
      chainSlug: config.chainSlug,
      tokenSymbol: config.tokenSymbol,
      tag: 'xDomainMessageRelay',
      prefix: config.label,
      logColor: 'yellow',
      order: config.order,
      isL1: config.isL1,
      bridgeContract: config.bridgeContract,
      dryMode: config.dryMode
    })
    this.l1Bridge = new L1Bridge(config.l1BridgeContract)
  }

  async pollHandler () {
    await this.checkTransfersCommittedFromDb()
  }

  async checkTransfersCommittedFromDb () {
    const dbTransferRoots = await this.db.transferRoots.getUnconfirmedTransferRoots({
      sourceChainId: await this.bridge.getChainId()
    })
    if (dbTransferRoots.length) {
      this.logger.debug(
        `checking ${dbTransferRoots.length} unconfirmed transfer roots db items`
      )
    }
    for (const dbTransferRoot of dbTransferRoots) {
      const {
        transferRootHash,
        destinationChainId,
        committedAt
      } = dbTransferRoot

      if (!this.lastSeen[transferRootHash]) {
        this.lastSeen[transferRootHash] = Date.now()
      }

      // only process message after waiting 10 minutes
      const timestampOk = this.lastSeen[transferRootHash] + TEN_MINUTES_MS < Date.now()
      if (!timestampOk) {
        continue
      }

      // Retry a tx if it is in the mempool for too long
      if (dbTransferRoot?.checkpointAttemptedAt) {
        const xDomainMessageSentTimestampOk = dbTransferRoot?.checkpointAttemptedAt + TX_RETRY_DELAY_MS <
            Date.now()
        if (!xDomainMessageSentTimestampOk) {
          continue
        }
      }

      // Parallelizing these calls produces RPC errors on Optimism
      await this.checkTransfersCommitted(
        transferRootHash,
        destinationChainId,
        committedAt
      )
    }
  }

  checkTransfersCommitted = async (
    transferRootHash: string,
    destinationChainId: number,
    committedAt: number
  ) => {
    const logger = this.logger.create({ root: transferRootHash })

    const dbTransferRoot = await this.db.transferRoots.getByTransferRootHash(
      transferRootHash
    )

    const chainSlug = this.chainIdToSlug(await this.bridge.getChainId())
    const l2Bridge = this.bridge as L2Bridge
    const { transferRootId } = dbTransferRoot
    const isTransferRootIdConfirmed = await this.l1Bridge.isTransferRootIdConfirmed(
      destinationChainId,
      transferRootId
    )
    // TODO: run poller only after event syncing has finished
    if (isTransferRootIdConfirmed) {
      await this.db.transferRoots.update(transferRootHash, {
        confirmed: true
      })
      return
    }

    let { commitTxHash } = dbTransferRoot
    if (!commitTxHash || commitTxHash) {
      commitTxHash = await l2Bridge.getTransferRootCommittedTxHash(
        transferRootHash
      )
      if (commitTxHash) {
        this.db.transferRoots.update(transferRootHash, {
          commitTxHash
        })
      }
    }
    if (!commitTxHash) {
      return
    }

    const shouldAttempt = this.shouldAttemptCheckpoint(
      dbTransferRoot,
      chainSlug
    )
    if (!shouldAttempt) {
      return
    }

    await this.db.transferRoots.update(transferRootHash, {
      checkpointAttemptedAt: Date.now()
    })

    if (chainSlug === Chain.xDai) {
      const l2Amb = getL2Amb(this.tokenSymbol)
      const tx: any = await this.bridge.getTransaction(commitTxHash)
      const sigEvents = await l2Amb?.queryFilter(
        l2Amb.filters.UserRequestForSignature(),
        tx.blockNumber - 1,
        tx.blockNumber + 1
      )

      for (const sigEvent of sigEvents) {
        const { encodedData } = sigEvent.args
        // TODO: better way of slicing by method id
        const data = /ef6ebe5e00000/.test(encodedData)
          ? encodedData.replace(/.*(ef6ebe5e00000.*)/, '$1')
          : ''
        if (data) {
          const {
            rootHash,
            originChainId,
            destinationChain
          } = await this.l1Bridge.decodeConfirmTransferRootData(
            '0x' + data.replace('0x', '')
          )
          this.logger.debug(
            `attempting to send relay message on xdai for commit tx hash ${commitTxHash}`
          )
          await this.handleStateSwitch()
          if (this.isDryOrPauseMode) {
            logger.warn(`dry: ${this.dryMode}, pause: ${this.pauseMode}. skipping executeExitTx`)
            return
          }
          const result = await executeExitTx(sigEvent, this.tokenSymbol)
          if (result) {
            await this.db.transferRoots.update(transferRootHash, {
              sentConfirmTx: true,
              sentConfirmTxAt: Date.now()
            })
            const { tx } = result
            tx?.wait()
              .then(async (receipt: any) => {
                if (receipt.status !== 1) {
                  await this.db.transferRoots.update(transferRootHash, {
                    sentConfirmTx: false,
                    sentConfirmTxAt: 0
                  })
                  throw new Error('status=0')
                }

                this.emit('transferRootConfirmed', {
                  transferRootHash,
                  destinationChainId
                })

                this.db.transferRoots.update(transferRootHash, {
                  confirmed: true
                })
              })
              .catch(async (err: Error) => {
                this.db.transferRoots.update(transferRootHash, {
                  sentConfirmTx: false,
                  sentConfirmTxAt: 0
                })

                throw err
              })
            logger.info('transferRootHash:', transferRootHash)
            logger.info(
              `sent chainId ${this.bridge.chainId} confirmTransferRoot L1 exit tx`,
              chalk.bgYellow.black.bold(tx.hash)
            )
            this.notifier.info(
              `chainId: ${this.bridge.chainId} confirmTransferRoot L1 exit tx: ${tx.hash}`
            )
            await tx.wait()
          }
        }
      }
    } else if (chainSlug === Chain.Polygon) {
      const poly = new PolygonBridgeWatcher({
        chainSlug: Chain.Polygon,
        tokenSymbol: this.tokenSymbol
      })
      const commitTx: any = await this.bridge.getTransaction(commitTxHash)
      const isCheckpointed = await poly.isCheckpointed(commitTx.blockNumber)
      if (!isCheckpointed) {
        this.logger.debug(
          `commit tx hash ${commitTxHash} block number ${commitTx.blockNumber} on polygon not yet checkpointed on L1. Cannot relay message yet.`
        )
        return false
      }

      this.logger.debug(
        `attempting to send relay message on polygon for commit tx hash ${commitTxHash}`
      )
      await this.handleStateSwitch()
      if (this.isDryOrPauseMode) {
        logger.warn(`dry: ${this.dryMode}, pause: ${this.pauseMode}. skipping relayMessage`)
        return
      }
      const tx = await poly.relayMessage(commitTxHash, this.tokenSymbol)
      await this.db.transferRoots.update(transferRootHash, {
        sentConfirmTx: true,
        sentConfirmTxAt: Date.now()
      })
      tx?.wait()
        .then(async (receipt: providers.TransactionReceipt) => {
          if (receipt.status !== 1) {
            await this.db.transferRoots.update(transferRootHash, {
              sentConfirmTx: false,
              sentConfirmTxAt: 0
            })
            throw new Error('status=0')
          }

          this.emit('transferRootConfirmed', {
            transferRootHash,
            destinationChainId
          })

          this.db.transferRoots.update(transferRootHash, {
            confirmed: true
          })
        })
        .catch(async (err: Error) => {
          this.db.transferRoots.update(transferRootHash, {
            sentConfirmTx: false,
            sentConfirmTxAt: 0
          })

          throw err
        })
      logger.info(
        `sent chainId ${this.bridge.chainId} confirmTransferRoot L1 exit tx`,
        chalk.bgYellow.black.bold(tx.hash)
      )
      this.notifier.info(
        `chainId: ${this.bridge.chainId} confirmTransferRoot L1 exit tx: ${tx.hash}`
      )
    } else {
      // not implemented

    }
  }

  shouldAttemptCheckpoint (dbTransferRoot: TransferRoot, chainSlug: string) {
    if (!chainSlug) {
      return false
    }

    if (!dbTransferRoot?.checkpointAttemptedAt) {
      return true
    }

    // TODO: Move this const to chain-specific location
    const checkpointIntervals: { [key: string]: number } = {
      polygon: 10 * 10 * 1000,
      xdai: 1 * 10 * 1000
    }

    const interval = checkpointIntervals[chainSlug]
    if (dbTransferRoot.checkpointAttemptedAt + interval < Date.now()) {
      return true
    }

    return false
  }
}

export default xDomainMessageRelayWatcher
