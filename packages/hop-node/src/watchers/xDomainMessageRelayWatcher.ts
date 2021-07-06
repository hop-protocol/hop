import '../moduleAlias'
import { ethers, Event, providers } from 'ethers'
import chalk from 'chalk'
import { wait, getRpcUrls } from 'src/utils'
import db from 'src/db'
import { TransferRoot } from 'src/db/TransferRootsDb'
import { Contract, BigNumber } from 'ethers'
import BaseWatcherWithEventHandlers from './classes/BaseWatcherWithEventHandlers'
import { Chain } from 'src/constants'
import L1Bridge from './classes/L1Bridge'
import L2Bridge from './classes/L2Bridge'
import { getL2Amb, executeExitTx } from './xDaiBridgeWatcher'
import PolygonBridgeWatcher from './PolygonBridgeWatcher'
import { config as gConfig } from 'src/config'
import { l1PolygonFxBaseRootTunnelAbi } from '@hop-protocol/abi'
import { TX_RETRY_DELAY_MS } from 'src/constants'

export interface Config {
  chainSlug: string
  isL1: boolean
  bridgeContract: Contract
  l1BridgeContract: Contract
  label: string
  token: string
  order?: () => number
  dryMode?: boolean
}

class xDomainMessageRelayWatcher extends BaseWatcherWithEventHandlers {
  l1Bridge: L1Bridge
  token: string

  constructor (config: Config) {
    super({
      chainSlug: config.chainSlug,
      tag: 'xDomainMessageRelay',
      prefix: config.label,
      logColor: 'yellow',
      order: config.order,
      isL1: config.isL1,
      bridgeContract: config.bridgeContract,
      dryMode: config.dryMode
    })
    this.l1Bridge = new L1Bridge(config.l1BridgeContract)
    this.token = config.token
  }

  async watch () {
    const handleError = (err: Error) => {
      this.logger.error(`event watcher error: ${err.message}`)
      this.notifier.error(`event watcher error: ${err.message}`)
      this.quit()
    }

    if (!this.isL1) {
      const l2Bridge = this.bridge as L2Bridge
      l2Bridge
        .on(l2Bridge.TransfersCommitted, this.handleTransfersCommittedEvent)
        .on('error', handleError)
    }

    this.bridge
      .on(
        this.l1Bridge.TransferRootConfirmed,
        this.handleTransferRootConfirmedEvent
      )
      .on('error', handleError)
    return
  }

  async pollCheck () {
    while (true) {
      if (!this.started) {
        return
      }
      try {
        await this.checkTransfersCommittedFromDb()
      } catch (err) {
        this.logger.error(`poll check error: ${err.message}`)
        this.notifier.error(`poll check error: ${err.message}`)
      }
      await wait(this.pollIntervalSec)
    }
  }

  async syncUp (): Promise<any> {
    this.logger.debug('syncing up events')
    if (this.isL1) {
      return
    }

    const promises: Promise<any>[] = []
    const l2Bridge = this.bridge as L2Bridge
    promises.push(
      this.l1Bridge.mapTransferRootConfirmedEvents(
        async (event: Event) => {
          return this.handleRawTransferRootConfirmedEvent(event)
        },
        { cacheKey: this.cacheKey(this.l1Bridge.TransferRootConfirmed) }
      )
    )

    promises.push(
      l2Bridge.mapTransfersCommittedEvents(
        async (event: Event) => {
          return this.handleRawTransfersCommittedEvent(event)
        },
        { cacheKey: l2Bridge.TransfersCommitted }
      )
    )

    await Promise.all(promises)
    this.logger.debug('done syncing')

    await wait(this.resyncIntervalSec)
    return this.syncUp()
  }

  async handleRawTransferRootConfirmedEvent (event: Event) {
    const {
      originChainId,
      destinationChainId,
      rootHash,
      totalAmount
    } = event.args
    await this.handleTransferRootConfirmedEvent(
      originChainId,
      destinationChainId,
      rootHash,
      totalAmount,
      event
    )
  }

  async handleRawTransfersCommittedEvent (event: Event) {
    const {
      destinationChainId,
      rootHash: transferRootHash,
      totalAmount,
      rootCommittedAt
    } = event.args
    await this.handleTransfersCommittedEvent(
      destinationChainId,
      transferRootHash,
      totalAmount,
      rootCommittedAt,
      event
    )
  }

  async checkTransfersCommittedFromDb () {
    const dbTransferRoots = await db.transferRoots.getUnconfirmedTransferRoots({
      sourceChainId: await this.bridge.getChainId()
    })
    if (dbTransferRoots.length) {
      this.logger.debug(
        `checking ${dbTransferRoots.length} unconfirmed transfer roots db items`
      )
    }
    for (let dbTransferRoot of dbTransferRoots) {
      const {
        transferRootHash,
        destinationChainId,
        committedAt
      } = dbTransferRoot
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

    const dbTransferRoot = await db.transferRoots.getByTransferRootHash(
      transferRootHash
    )

    const chainSlug = this.chainIdToSlug(await this.bridge.getChainId())
    const l2Bridge = this.bridge as L2Bridge
    const { transferRootId } = dbTransferRoot
    const isTransferRootIdConfirmed = await this.l1Bridge.isTransferRootIdConfirmed(
      transferRootId
    )
    // TODO: run poller only after event syncing has finished
    if (isTransferRootIdConfirmed) {
      await db.transferRoots.update(transferRootHash, {
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
        db.transferRoots.update(transferRootHash, {
          commitTxHash
        })
      }
    }
    if (!commitTxHash) {
      return
    }

    if (
      (dbTransferRoot?.sentConfirmTx || dbTransferRoot?.confirmed) &&
      dbTransferRoot.sentConfirmTxAt
    ) {
      // skip if a transaction was sent in the last 10 minutes
      if (dbTransferRoot.sentConfirmTxAt + TX_RETRY_DELAY_MS > Date.now()) {
        logger.debug(
          'sent?:',
          !!dbTransferRoot.sentConfirmTx,
          'confirmed?:',
          !!dbTransferRoot?.confirmed
        )
      }
      return
    }

    const shouldAttempt = this.shouldAttemptCheckpoint(
      dbTransferRoot,
      chainSlug
    )
    if (!shouldAttempt) {
      return
    }

    await db.transferRoots.update(transferRootHash, {
      checkpointAttemptedAt: Date.now()
    })

    if (chainSlug === Chain.xDai) {
      const l2Amb = getL2Amb(this.token)
      const tx: any = await this.bridge.getTransaction(commitTxHash)
      const sigEvents = await l2Amb?.queryFilter(
        l2Amb.filters.UserRequestForSignature(),
        tx.blockNumber - 1,
        tx.blockNumber + 1
      )

      for (let sigEvent of sigEvents) {
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
          if (this.dryMode) {
            this.logger.warn('dry mode: skipping executeExitTx transaction')
            return
          }
          const result = await executeExitTx(sigEvent, this.token)
          if (result) {
            await db.transferRoots.update(transferRootHash, {
              sentConfirmTx: true,
              sentConfirmTxAt: Date.now()
            })
            const { tx } = result
            tx?.wait()
              .then(async (receipt: any) => {
                if (receipt.status !== 1) {
                  await db.transferRoots.update(transferRootHash, {
                    sentConfirmTx: false,
                    sentConfirmTxAt: 0
                  })
                  throw new Error('status=0')
                }

                this.emit('transferRootConfirmed', {
                  transferRootHash,
                  destinationChainId
                })

                db.transferRoots.update(transferRootHash, {
                  confirmed: true
                })
              })
              .catch(async (err: Error) => {
                db.transferRoots.update(transferRootHash, {
                  sentConfirmTx: false,
                  sentConfirmTxAt: 0
                })

                throw err
              })
            logger.info(`transferRootHash:`, transferRootHash)
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
      const poly = this.getPolyInstance()
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
      if (this.dryMode) {
        this.logger.warn('dry mode: skipping relayMessage transaction')
        return
      }
      const tx = await poly.relayMessage(commitTxHash, this.token)
      await db.transferRoots.update(transferRootHash, {
        sentConfirmTx: true,
        sentConfirmTxAt: Date.now()
      })
      tx?.wait()
        .then(async (receipt: providers.TransactionReceipt) => {
          if (receipt.status !== 1) {
            await db.transferRoots.update(transferRootHash, {
              sentConfirmTx: false,
              sentConfirmTxAt: 0
            })
            throw new Error('status=0')
          }

          this.emit('transferRootConfirmed', {
            transferRootHash,
            destinationChainId
          })

          db.transferRoots.update(transferRootHash, {
            confirmed: true
          })
        })
        .catch(async (err: Error) => {
          db.transferRoots.update(transferRootHash, {
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
      return
    }
  }

  getPolyInstance () {
    // TODO: These params should be passed into constructor and this should not be a standalone
    // function
    const poly = new PolygonBridgeWatcher({
      chainSlug: Chain.Polygon,
      token: this.token
    })
    const privateKey = gConfig.relayerPrivateKey || gConfig.bonderPrivateKey
    poly.l1Provider = new ethers.providers.StaticJsonRpcProvider(
      getRpcUrls(Chain.Ethereum)[0]
    )
    poly.l2Provider = new ethers.providers.StaticJsonRpcProvider(
      getRpcUrls(Chain.Polygon)[0]
    )
    poly.l1Wallet = new ethers.Wallet(privateKey, poly.l1Provider)
    poly.l2Wallet = new ethers.Wallet(privateKey, poly.l2Provider)
    poly.chainId = 1
    poly.apiUrl = `https://apis.matic.network/api/v1/${
      poly.chainId === 1 ? 'matic' : 'mumbai'
    }/block-included`

    return poly
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
