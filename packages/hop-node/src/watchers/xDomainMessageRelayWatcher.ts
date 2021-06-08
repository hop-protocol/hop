import '../moduleAlias'
import { ethers } from 'ethers'
import chalk from 'chalk'
import { wait, getRpcUrls } from 'src/utils'
import db from 'src/db'
import { Contract, BigNumber } from 'ethers'
import BaseWatcher from './classes/BaseWatcher'
import { Chain } from 'src/constants'
import L1Bridge from './classes/L1Bridge'
import L2Bridge from './classes/L2Bridge'
import { getL2Amb, executeExitTx } from './xDaiBridgeWatcher'
import PolygonBridgeWatcher from './PolygonBridgeWatcher'
import { config as gConfig } from 'src/config'
import { l1PolygonFxBaseRootTunnelAbi } from '@hop-protocol/abi'

export interface Config {
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
  token: string

  constructor (config: Config) {
    super({
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

  async start () {
    this.started = true
    try {
      await Promise.all([this.syncUp(), this.watch(), this.pollCheck()])
    } catch (err) {
      this.logger.error(`watcher error:`, err.message)
      this.notifier.error(`watcher error: ${err.message}`)
    }
  }

  async pollCheck () {
    while (true) {
      if (!this.started) {
        return
      }
      try {
        await this.checkTransfersCommittedFromDb()
      } catch (err) {
        this.logger.error('poll check error:', err.message)
        this.notifier.error(`poll check error: ${err.message}`)
      }
      await wait(10 * 1000)
    }
  }

  async watch () {
    if (this.isL1) {
      this.bridge
        .on(
          this.l1Bridge.TransferRootConfirmed,
          this.handleTransferRootConfirmedEvent
        )
        .on('error', err => {
          this.logger.error(`event watcher error:`, err.message)
          this.quit()
        })
      return
    }
  }

  async stop () {
    this.bridge.removeAllListeners()
    this.started = false
    this.logger.setEnabled(false)
  }

  async syncUp (): Promise<any> {
    this.logger.debug('syncing up events')
    if (this.isL1) {
      return
    }

    const l2Bridge = this.bridge as L2Bridge

    const promises: Promise<any>[] = []
    promises.push(
      this.l1Bridge.eventsBatch(
        async (start: number, end: number) => {
          const transferRootConfirmedEvents = await this.l1Bridge.getTransferRootConfirmedEvents(
            start,
            end
          )

          const promises: Promise<any>[] = []
          for (let event of transferRootConfirmedEvents) {
            const {
              originChainId,
              destinationChainId,
              rootHash,
              totalAmount
            } = event.args
            promises.push(
              this.handleTransferRootConfirmedEvent(
                originChainId,
                destinationChainId,
                rootHash,
                totalAmount
              )
            )
          }

          await Promise.all(promises)
        },
        { key: this.l1Bridge.TransferRootConfirmed }
      )
    )

    promises.push(
      this.eventsBatch(async (start: number, end: number) => {
        try {
          const transferCommitEvents = await l2Bridge.getTransfersCommittedEvents(
            start,
            end
          )
          for (let transferCommitEvent of transferCommitEvents) {
            const {
              rootHash: transferRootHash,
              totalAmount,
              rootCommittedAt
            } = transferCommitEvent.args
            const { data } = await this.bridge.getTransaction(
              transferCommitEvent.transactionHash
            )
            const {
              destinationChainId: chainId
            } = await l2Bridge.decodeCommitTransfersData(data)
            await db.transferRoots.update(transferRootHash, {
              transferRootHash,
              committed: true,
              committedAt: Number(rootCommittedAt.toString()),
              chainId,
              totalAmount
            })
          }
        } catch (err) {
          this.logger.error(`watcher error:`, err.message)
          this.notifier.error(`watcher error: '${err.message}`)
        }
      })
    )

    await Promise.all(promises)
    this.logger.debug('done syncing')

    // re-sync every 6 hours
    const sixHours = 6 * 60 * 60 * 1000
    await wait(sixHours)
    return this.syncUp()
  }

  async checkTransfersCommittedFromDb () {
    const dbTransferRoots = await db.transferRoots.getUnconfirmedTransferRoots()
    const promises: Promise<any>[] = []
    for (let dbTransferRoot of dbTransferRoots) {
      const { transferRootHash, chainId, committedAt } = dbTransferRoot
      promises.push(
        this.checkTransfersCommitted(transferRootHash, chainId, committedAt)
      )
    }
    await Promise.all(promises)
  }

  checkTransfersCommitted = async (
    transferRootHash: string,
    chainId: number,
    committedAt: number
  ) => {
    const dbTransferRoot = await db.transferRoots.getByTransferRootHash(
      transferRootHash
    )
    if (dbTransferRoot.confirmed) {
      return
    }

    const l2Bridge = this.bridge as L2Bridge
    const bridgeChainId = await l2Bridge.getChainId()
    const sourceChainId = dbTransferRoot.sourceChainId
    if (!sourceChainId) {
      return
    }
    const sourceChainSlug = this.chainIdToSlug(sourceChainId)
    if (bridgeChainId !== sourceChainId) {
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

    const chainSlug = this.chainIdToSlug(await this.bridge.getChainId())
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
          if (
            (dbTransferRoot?.sentConfirmTx || dbTransferRoot?.confirmed) &&
            dbTransferRoot.sentConfirmTxAt
          ) {
            const tenMinutes = 60 * 10 * 1000
            // skip if a transaction was sent in the last 10 minutes
            if (dbTransferRoot.sentConfirmTxAt + tenMinutes > Date.now()) {
              this.logger.debug(
                'sent?:',
                !!dbTransferRoot.sentConfirmTx,
                'confirmed?:',
                !!dbTransferRoot?.confirmed
              )
            }
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
                  chainId
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
            this.logger.info(`transferRootHash:`, transferRootHash)
            this.logger.info(
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
      const poly = new PolygonBridgeWatcher()
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

      if (
        (dbTransferRoot?.sentConfirmTx || dbTransferRoot?.confirmed) &&
        dbTransferRoot.sentConfirmTxAt
      ) {
        const tenMinutes = 60 * 10 * 1000
        // skip if a transaction was sent in the last 10 minutes
        if (dbTransferRoot.sentConfirmTxAt + tenMinutes > Date.now()) {
          this.logger.debug(
            'sent?:',
            !!dbTransferRoot.sentConfirmTx,
            'confirmed?:',
            !!dbTransferRoot?.confirmed
          )
        }
        return
      }

      const tx = await poly.relayMessage(commitTxHash, this.token)
      await db.transferRoots.update(transferRootHash, {
        sentConfirmTx: true,
        sentConfirmTxAt: Date.now()
      })
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
            chainId
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
      this.logger.info(
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

  handleTransferRootConfirmedEvent = async (
    sourceChainId: BigNumber,
    destChainId: BigNumber,
    transferRootHash: string,
    meta: any
  ) => {
    this.logger.debug('received TransferRootConfirmed event')
    try {
      const { transactionHash } = meta
      await db.transferRoots.update(transferRootHash, {
        confirmed: true,
        confirmTxHash: transactionHash
      })
    } catch (err) {
      this.logger.error('error:', err.message)
    }
  }
}

export default xDomainMessageRelayWatcher
