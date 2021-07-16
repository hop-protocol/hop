import '../moduleAlias'
import BaseWatcherWithEventHandlers from './classes/BaseWatcherWithEventHandlers'
import L1Bridge from './classes/L1Bridge'
import L2Bridge from './classes/L2Bridge'
import MerkleTree from 'src/utils/MerkleTree'
import chalk from 'chalk'
import db from 'src/db'
import { BigNumber, Contract, providers } from 'ethers'
import { Event } from 'src/types'
import { TX_RETRY_DELAY_MS } from 'src/constants'
import { Transfer } from 'src/db/TransfersDb'
import { wait } from 'src/utils'

export interface Config {
  chainSlug: string
  isL1: boolean
  bridgeContract: Contract
  label: string
  order?: () => number
  dryMode?: boolean
  minThresholdPercent: number
}

const BONDER_ORDER_DELAY_MS = 60 * 1000

class SettleBondedWithdrawalWatcher extends BaseWatcherWithEventHandlers {
  siblingWatchers: { [chainId: string]: SettleBondedWithdrawalWatcher }
  shouldWaitMinThreshold: boolean = false

  constructor (config: Config) {
    super({
      chainSlug: config.chainSlug,
      tag: 'settleBondedWithdrawalWatcher',
      prefix: config.label,
      logColor: 'magenta',
      order: config.order,
      isL1: config.isL1,
      bridgeContract: config.bridgeContract,
      dryMode: config.dryMode
    })
  }

  async syncHandler (): Promise<any> {
    const promises: Promise<any>[] = []
    if (!this.isL1) {
      const l2Bridge = this.bridge as L2Bridge
      promises.push(
        l2Bridge.mapTransferSentEvents(
          async (event: Event) => {
            return this.handleRawTransferSentEvent(event)
          },
          { cacheKey: this.cacheKey(l2Bridge.TransferSent) }
        )
      )

      promises.push(
        l2Bridge.mapTransfersCommittedEvents(
          async (event: Event) => {
            return this.handleRawTransfersCommittedEvent(event)
          },
          { cacheKey: this.cacheKey(l2Bridge.TransfersCommitted) }
        )
      )
    } else if (this.isL1) {
      const l1Bridge = this.bridge as L1Bridge
      promises.push(
        l1Bridge.mapTransferRootConfirmedEvents(
          async (event: Event) => {
            return this.handleRawTransferRootConfirmedEvent(event)
          },
          { cacheKey: this.cacheKey(l1Bridge.TransferRootConfirmed) }
        )
      )
    }

    promises.push(
      this.bridge
        .mapWithdrawalBondedEvents(
          async (event: Event) => {
            return this.handleRawWithdrawalBondedEvent(event)
          },
          { cacheKey: this.cacheKey(this.bridge.WithdrawalBonded) }
        )
        .then(() => {
          // This must be executed after the WithdrawalBonded event handler on initial sync
          // since it relies on data from that handler.
          return this.bridge.mapMultipleWithdrawalsSettledEvents(
            async (event: Event) => {
              return this.handleRawMultipleWithdrawalsSettledEvent(event)
            },
            { cacheKey: this.cacheKey(this.bridge.MultipleWithdrawalsSettled) }
          )
        })
    )

    promises.push(
      this.bridge.mapTransferRootSetEvents(
        async (event: Event) => {
          return this.handleRawTransferRootSetEvent(event)
        },
        { cacheKey: this.cacheKey(this.bridge.TransferRootSet) }
      )
    )

    await Promise.all(promises)
  }

  async watch () {
    if (this.isL1) {
      const l1Bridge = this.bridge as L1Bridge
      this.bridge
        .on(
          l1Bridge.TransferRootConfirmed,
          this.handleTransferRootConfirmedEvent
        )
        .on('error', err => {
          this.logger.error(`event watcher error: ${err.message}`)
          this.notifier.error(`event watcher error: ${err.message}`)
          this.quit()
        })
      return
    }
    this.bridge
      .on(this.bridge.TransferRootSet, this.handleTransferRootSetEvent)
      .on(this.bridge.WithdrawalBonded, this.handleWithdrawalBondedEvent)
      .on(
        this.bridge.MultipleWithdrawalsSettled,
        this.handleMultipleWithdrawalsSettledEvent
      )
      .on('error', err => {
        this.logger.error(`event watcher error: ${err.message}`)
        this.notifier.error(`event watcher error: ${err.message}`)
        this.quit()
      })
  }

  async pollHandler () {
    const promises: Promise<any>[] = []
    promises.push(
      new Promise(async resolve => {
        try {
          await this.checkUnsettledTransfersFromDb()
        } catch (err) {
          this.logger.error(
            `poll error checkUnsettledTransfers: ${err.message}`
          )
          this.notifier.error(
            `poll error checkUnsettledTransfers: ${err.message}`
          )
        }
        resolve(null)
      })
    )
    await Promise.all(promises)
  }

  async handleRawTransfersCommittedEvent (event: Event) {
    const {
      destinationChainId,
      rootHash,
      totalAmount,
      rootCommittedAt
    } = event.args
    await this.handleTransfersCommittedEvent(
      destinationChainId,
      rootHash,
      totalAmount,
      rootCommittedAt,
      event
    )
  }

  async handleRawTransferRootConfirmedEvent (event: Event) {
    const {
      originChainId: sourceChainId,
      destinationChainId,
      rootHash,
      totalAmount
    } = event.args
    await this.handleTransferRootConfirmedEvent(
      sourceChainId,
      destinationChainId,
      rootHash,
      totalAmount,
      event
    )
  }

  async handleRawTransferSentEvent (event: Event) {
    const {
      transferId,
      chainId: destinationChainId,
      recipient,
      amount,
      transferNonce,
      bonderFee,
      index,
      amountOutMin,
      deadline
    } = event.args
    await this.handleTransferSentEvent(
      transferId,
      destinationChainId,
      recipient,
      amount,
      transferNonce,
      bonderFee,
      index,
      amountOutMin,
      deadline,
      event
    )
  }

  async handleRawWithdrawalBondedEvent (event: Event) {
    const { transferId, amount } = event.args
    await this.handleWithdrawalBondedEvent(transferId, amount, event)
  }

  async handleRawTransferRootSetEvent (event: Event) {
    const { rootHash, totalAmount } = event.args
    await this.handleTransferRootSetEvent(rootHash, totalAmount, event)
  }

  async handleRawMultipleWithdrawalsSettledEvent (event: Event) {
    const { bonder, rootHash, totalBondsSettled } = event.args
    await this.handleMultipleWithdrawalsSettledEvent(
      bonder,
      rootHash,
      totalBondsSettled,
      event
    )
  }

  handleTransferRootSetEvent = async (
    transferRootHash: string,
    totalAmount: BigNumber,
    event: Event
  ) => {
    const logger = this.logger.create({ root: transferRootHash })
    const { transactionHash } = event
    const timestamp = await this.bridge.getEventTimestamp(event)
    const transferRootId = await this.bridge.getTransferRootId(
      transferRootHash,
      totalAmount
    )
    logger.debug('handling TransferRootSet event')
    logger.debug(`transferRootHash from event: ${transferRootHash}`)
    logger.debug(`transferRootId: ${transferRootId}`)
    logger.debug(`bondAmount: ${this.bridge.formatUnits(totalAmount)}`)
    logger.debug(`event transactionHash: ${transactionHash}`)
    logger.debug(`rootSetTimestamp: ${timestamp}`)
    await db.transferRoots.update(transferRootHash, {
      rootSetTxHash: transactionHash,
      rootSetTimestamp: timestamp
    })
  }

  handleMultipleWithdrawalsSettledEvent = async (
    bonder: string,
    transferRootHash: string,
    totalBondsSettled: BigNumber,
    event: Event
  ) => {
    const { transactionHash } = event
    const { data } = await this.bridge.getTransaction(transactionHash)
    const { transferIds } = await this.bridge.decodeSettleBondedWithdrawalsData(
      data
    )
    for (const transferId of transferIds) {
      const dbTransfer = await db.transfers.getByTransferId(transferId)
      await db.transfers.update(transferId, {
        withdrawalBondSettled: dbTransfer?.withdrawalBonded ?? false
      })
    }
  }

  checkUnsettledTransfersFromDb = async () => {
    const initialSyncCompleted = await this.isAllSiblingWatchersInitialSyncCompleted()
    if (!initialSyncCompleted) {
      return false
    }

    // only process transfer where this bridge is the destination chain
    const dbTransfers: Transfer[] = await db.transfers.getUnsettledBondedWithdrawalTransfers(
      {
        destinationChainId: await this.bridge.getChainId()
      }
    )
    const filtered: Transfer[] = []
    const filteredRootHashes: string[] = []
    for (const dbTransfer of dbTransfers) {
      if (filteredRootHashes.includes(dbTransfer.transferRootHash)) {
        continue
      }
      const dbTransferRoot = await db.transferRoots.getByTransferRootHash(
        dbTransfer.transferRootHash
      )
      if (!dbTransferRoot) {
        this.logger.warn(
          `no db transfer root transfer id ${dbTransfer.transferId}`
        )
        continue
      }

      let rootSetTimestampOk = true
      if (dbTransferRoot?.rootSetTimestamp) {
        rootSetTimestampOk = dbTransferRoot.rootSetTimestamp * 1000 + TX_RETRY_DELAY_MS < Date.now()
      }

      let bondSettleTimestampOk = true
      if (dbTransferRoot?.withdrawalBondSettleTxSentAt) {
        bondSettleTimestampOk =
          dbTransferRoot?.withdrawalBondSettleTxSentAt + TX_RETRY_DELAY_MS <
          Date.now()
      }

      const ok =
        !!dbTransferRoot.destinationChainId &&
        !!dbTransferRoot.totalAmount &&
        !!dbTransferRoot.confirmed &&
        !!dbTransferRoot.confirmTxHash &&
        !!dbTransferRoot.committed &&
        !!dbTransferRoot.committedAt &&
        !!dbTransferRoot.rootSetTxHash &&
        rootSetTimestampOk &&
        bondSettleTimestampOk

      if (!ok) {
        continue
      }

      if (!dbTransferRoot?.transferIds?.length) {
        this.logger.warn(
          `db transfer root hash ${dbTransferRoot.transferRootHash} doesn't contain any transfer ids`
        )
        continue
      }

      filtered.push(dbTransfer)
      filteredRootHashes.push(dbTransfer.transferRootHash)
    }
    if (filtered.length) {
      this.logger.debug(
        `checking ${filtered.length} unsettled bonded withdrawal transfers db items`
      )
    }
    const promises: Promise<any>[] = []
    for (const dbTransfer of filtered) {
      promises.push(
        new Promise(async resolve => {
          try {
            await this.checkUnsettledTransfer(dbTransfer)
          } catch (err) {
            this.logger.error('checkUnsettledTransfer error:', err.message)
          }
          resolve(null)
        })
      )
    }

    await Promise.all(promises)
  }

  checkUnsettledTransfer = async (dbTransfer: Transfer) => {
    try {
      const dbTransferRoot = await db.transferRoots.getByTransferRootHash(
        dbTransfer.transferRootHash
      )
      const {
        transferRootHash: dbTransferRootHash,
        destinationChainId,
        totalAmount
      } = dbTransferRoot
      const transferIds: string[] = Object.values(
        dbTransferRoot.transferIds || []
      )

      const logger = this.logger.create({ root: dbTransferRootHash })
      const destBridge = this.getSiblingWatcherByChainId(destinationChainId)
        .bridge

      logger.debug(
        'transferRootId:',
        chalk.bgMagenta.black(dbTransfer.transferRootId)
      )

      const tree = new MerkleTree(transferIds)
      const transferRootHash = tree.getHexRoot()
      if (transferRootHash !== dbTransferRootHash) {
        logger.debug('transferIds:\n', JSON.stringify(transferIds))
        logger.error(
          `transfers computed transfer root hash doesn't match. Expected ${dbTransferRootHash}`
        )
        await db.transferRoots.update(dbTransferRootHash, {
          transferIds: []
        })
        return
      }

      const bonder = dbTransfer.withdrawalBonder
      logger.debug('sourceChainId:', dbTransfer.sourceChainId)
      logger.debug('destinationChainId:', destinationChainId)
      logger.debug('computed transferRootHash:', transferRootHash)
      logger.debug('bonder:', bonder)
      logger.debug('totalAmount:', this.bridge.formatUnits(totalAmount))
      logger.debug('transferIds:\n', JSON.stringify(transferIds))

      if (this.dryMode) {
        logger.warn('dry mode: skipping settleBondedWithdrawals transaction')
        return
      }

      await db.transferRoots.update(transferRootHash, {
        withdrawalBondSettleTxSentAt: Date.now()
      })
      logger.debug('sending settle tx')
      const tx = await destBridge.settleBondedWithdrawals(
        bonder,
        transferIds,
        totalAmount
      )
      tx?.wait()
        .then(async (receipt: providers.TransactionReceipt) => {
          if (receipt.status !== 1) {
            await db.transferRoots.update(transferRootHash, {
              withdrawalBondSettleTxSentAt: 0
            })
            throw new Error('status=0')
          }
          this.emit('settleBondedWithdrawal', {
            transferRootHash,
            networkName: this.chainIdToSlug(destinationChainId),
            chainId: destinationChainId,
            transferId: dbTransfer.transferId
          })

          for (const transferId of transferIds) {
            const dbTransfer = await db.transfers.getByTransferId(transferId)
            await db.transfers.update(transferId, {
              withdrawalBondSettled: dbTransfer?.withdrawalBonded ?? false
            })
          }
        })
        .catch(async (err: Error) => {
          await db.transferRoots.update(transferRootHash, {
            withdrawalBondSettleTxSentAt: 0
          })

          throw err
        })
      logger.info(
        `settleBondedWithdrawals on destinationChainId:${destinationChainId} tx: ${chalk.bgYellow.black.bold(
          tx.hash
        )}`
      )
      this.notifier.info(
        `settleBondedWithdrawals on destinationChainId:${destinationChainId} tx: ${tx.hash}`
      )
    } catch (err) {
      if (err.message !== 'cancelled') {
        this.logger.error('settleBondedWithdrawal error:', err.message)
        this.notifier.error(`settleBondedWithdrawal error: ${err.message}`)
      }
      await db.transfers.update(dbTransfer.transferId, {
        withdrawalBondSettleTxSentAt: 0
      })
    }
  }

  async waitTimeout (transferId: string, destinationChainId: number) {
    await wait(2 * 1000)
    if (!this.order()) {
      return
    }
    this.logger.debug(
      `waiting for settle bonded withdrawal event. transferId: ${transferId} destinationChainId: ${destinationChainId}`
    )
    const bridge = this.getSiblingWatcherByChainId(destinationChainId).bridge
    let timeout = this.order() * BONDER_ORDER_DELAY_MS
    while (timeout > 0) {
      if (!this.started) {
        return
      }

      // TODO
      // break

      const delay = 2 * 1000
      timeout -= delay
      await wait(delay)
    }
    if (timeout <= 0) {
      return
    }
    this.logger.debug(`transfer id already bonded ${transferId}`)
    throw new Error('cancelled')
  }
}

export default SettleBondedWithdrawalWatcher
