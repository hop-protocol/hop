import '../moduleAlias'
import { Contract, BigNumber, Event } from 'ethers'
import { parseUnits, formatUnits } from 'ethers/lib/utils'
import { wait, isL1ChainId } from 'src/utils'
import db from 'src/db'
import { TransferRoot } from 'src/db/TransferRootsDb'
import { Transfer } from 'src/db/TransfersDb'
import chalk from 'chalk'
import BaseWatcherWithEventHandlers from './classes/BaseWatcherWithEventHandlers'
import Bridge from './classes/Bridge'
import L1Bridge from './classes/L1Bridge'
import L2Bridge from './classes/L2Bridge'
import Token from './classes/Token'
import MerkleTree from 'src/utils/MerkleTree'

export interface Config {
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
  minThresholdPercent: number = 0.5 // 50%
  shouldWaitMinThreshold: boolean = false

  constructor (config: Config) {
    super({
      tag: 'settleBondedWithdrawalWatcher',
      prefix: config.label,
      logColor: 'magenta',
      order: config.order,
      isL1: config.isL1,
      bridgeContract: config.bridgeContract,
      dryMode: config.dryMode
    })
    if (config.minThresholdPercent) {
      this.minThresholdPercent = config.minThresholdPercent
      if (this.minThresholdPercent > 1 || this.minThresholdPercent < 0) {
        throw new Error('minThresholdAmount must be between 0 and 1')
      }
    }
  }

  async start () {
    this.started = true
    try {
      this.logger.debug(
        `minThresholdAmount: ${this.minThresholdPercent * 100}%`
      )
      await Promise.all([this.syncUp(), this.watch(), this.pollCheck()])
    } catch (err) {
      this.logger.error(`watcher error:`, err.message)
      this.notifier.error(`watcher error: ${err.message}`)
      this.quit()
    }
  }

  async syncUp (): Promise<any> {
    this.logger.debug('syncing up events')

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
    }

    promises.push(
      this.bridge.mapMultipleWithdrawalsSettledEvents(
        async (event: Event) => {
          return this.handleRawMultipleWithdrawalsSettledEvent(event)
        },
        { cacheKey: this.cacheKey(this.bridge.MultipleWithdrawalsSettled) }
      )
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
    this.logger.debug('done syncing')

    await wait(this.resyncIntervalSec)
    return this.syncUp()
  }

  async syncTransferRootHashForTransferIds () {
    const dbTransfers = await db.transfers.getBondedTransfersWithoutRoots({
      sourceChainId: await this.bridge.getChainId()
    })
    this.logger.debug(
      `checking ${dbTransfers.length} bonded transfers without roots db items`
    )
    const promises: Promise<any>[] = []
    for (let dbTransfer of dbTransfers) {
      const { transferId, transferSentTxHash } = dbTransfer
      const transferRoots = await db.transferRoots.getTransferRoots()

      // check if any transfer roots already contain the transfer id in it's list
      for (let root of transferRoots) {
        if (root.transferIds) {
          for (let tId of root.transferIds) {
            if (tId === transferId) {
              await db.transfers.update(transferId, {
                transferRootId: root.transferRootId,
                transferRootHash: root.transferRootHash
              })
              break
            }
          }
        }
      }
    }
    // TODO: fetch transfer root hash for transfer id more efficiently
    await this.bridge.mapTransferRootSetEvents(async (event: any) => {
      const { rootHash: transferRootHash } = event.args
      const dbTransferRoot = await db.transferRoots.getByTransferRootHash(
        transferRootHash
      )
      if (!dbTransferRoot.transferIds?.length) {
        await this.findTransferIdsForTransferRootHash(transferRootHash)
      }
    })
  }

  async watch () {
    this.bridge
      .on(this.bridge.TransferRootSet, this.handleTransferRootSetEvent)
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

  async pollCheck () {
    while (true) {
      if (!this.started) {
        return
      }
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
      const lookupmMissingTransferRootHashes = false
      if (lookupmMissingTransferRootHashes) {
        promises.push(
          new Promise(async resolve => {
            try {
              await this.syncTransferRootHashForTransferIds()
            } catch (err) {
              this.logger.error(`poll error: ${err.message}`)
              this.notifier.error(`poll error: ${err.message}`)
            }
            resolve(null)
          })
        )
      }
      await Promise.all(promises)
      await wait(this.pollIntervalSec)
    }
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

  async handleRawTransferSentEvent (event: Event) {
    const {
      transferId,
      chainId,
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
      chainId,
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

  async handleRawTransferRootSetEvent (event: Event) {
    const { rootHash, totalAmount } = event.args
    await this.handleTransferRootSetEvent(rootHash, totalAmount, event)
  }

  async handleRawMultipleWithdrawalsSettledEvent (event: Event) {
    const { bonder, rootHash, totalBondsSettled } = event.args
    const { transactionHash } = event
    const { data } = await this.bridge.getTransaction(transactionHash)

    const { transferIds } = await this.bridge.decodeSettleBondedWithdrawalsData(
      data
    )
    await this.handleMultipleWithdrawalsSettledEvent(
      bonder,
      rootHash,
      totalBondsSettled,
      transferIds
    )
  }

  handleTransferRootSetEvent = async (
    transferRootHash: string,
    totalAmount: BigNumber,
    meta: any
  ) => {
    const logger = this.logger.create({ root: transferRootHash })
    let dbTransferRoot = await db.transferRoots.getByTransferRootHash(
      transferRootHash
    )
    if (!dbTransferRoot) {
      return
    }
    const { transactionHash } = meta
    const transferRootId = await this.bridge.getTransferRootId(
      transferRootHash,
      totalAmount
    )
    const sourceChainId =
      dbTransferRoot.sourceChainId || (await this.bridge.getChainId())
    const destinationChainId = dbTransferRoot.chainId
    logger.debug(`handling TransferRootSet event`)
    // logger.debug(`transferRootHash from event: ${transferRootHash}`)
    // logger.debug(`transferRootId: ${transferRootId}`)
    // logger.debug(`bondAmount: ${this.bridge.formatUnits(totalAmount)}`)
    // logger.debug(`event transactionHash: ${transactionHash}`)
    await db.transferRoots.update(transferRootHash, {
      committed: true,
      transferRootId,
      transferRootHash,
      sourceChainId,
      rootSetTxHashes: Object.assign({}, dbTransferRoot.rootSetTxHashes || {}, {
        [destinationChainId]: transactionHash
      })
    })

    if (!dbTransferRoot.transferIds?.length) {
      await this.findTransferIdsForTransferRootHash(transferRootHash)
    }

    dbTransferRoot = await db.transferRoots.getByTransferRootHash(
      transferRootHash
    )
    if (!dbTransferRoot) {
      logger.warn(
        `db transfer root not found for root hash ${transferRootHash}`
      )
      return
    }
    if (!dbTransferRoot.transferIds?.length) {
      logger.warn(`no db transfers found for transfer root ${transferRootHash}`)
      return
    }

    await this.updateTransferRootHashForTransferIds(dbTransferRoot)
  }

  async updateTransferRootHashForTransferIds (dbTransferRoot: TransferRoot) {
    const { transferRootHash, transferRootId } = dbTransferRoot
    const logger = this.logger.create({ root: transferRootHash })
    for (let dbTransferId of dbTransferRoot.transferIds) {
      const dbTransfer = await db.transfers.getByTransferId(dbTransferId)
      if (!dbTransfer) {
        logger.warn(`no db transfer found for transfer id ${dbTransferId}`)
      }
      await db.transfers.update(dbTransferId, {
        transferRootId,
        transferRootHash
      })
      if (!dbTransfer?.transferRootId) {
        logger.debug(
          `updated db transfer id hash ${dbTransferId} to have transfer root id ${transferRootId}`
        )
      }
    }
  }

  async findTransferIdsForTransferRootHash (transferRootHash: string) {
    const logger = this.logger.create({ root: transferRootHash })
    const {
      sourceChainId,
      chainId: destinationChainId
    } = await db.transferRoots.getByTransferRootHash(transferRootHash)
    logger.debug(
      `looking for transfer ids for transferRootHash ${transferRootHash}`
    )
    if (!this.hasSiblingWatcher(sourceChainId)) {
      logger.error(`no sibling watcher found for ${sourceChainId}`)
      return
    }
    const sourceBridge = this.getSiblingWatcherByChainId(sourceChainId)
      .bridge as L2Bridge

    let startSearchBlockNumber: number
    let startEvent: any
    let endEvent: any
    await sourceBridge.eventsBatch(async (start: number, end: number) => {
      startSearchBlockNumber = start
      let events = await sourceBridge.getTransfersCommittedEvents(start, end)
      if (!events?.length) {
        return true
      }

      // events need to be sorted from [newest...oldest] in order to pick up the endEvent first
      events = events.reverse()
      for (let event of events) {
        let eventTransferRoot = await db.transferRoots.getByTransferRootHash(
          event.args.rootHash
        )

        if (event.args.rootHash === transferRootHash) {
          endEvent = event
          continue
        }

        const isSameChainId = eventTransferRoot.chainId === destinationChainId
        if (endEvent && isSameChainId) {
          startEvent = event
          return false
        }
      }

      return true
    })

    if (!endEvent) {
      return
    }

    let startBlockNumber
    let endBlockNumber = endEvent.blockNumber
    if (startEvent) {
      startBlockNumber = startEvent.blockNumber
    } else {
      // There will not be a startEvent if this was the first CommitTransfers event for
      // this token since the deployment of the bridge contract
      const sourceBridgeAddress = sourceBridge.getAddress()
      const codeAtAddress = await sourceBridge.getCode(
        sourceBridgeAddress,
        startSearchBlockNumber
      )
      if (codeAtAddress === '0x') {
        startBlockNumber = startSearchBlockNumber
      }

      // There is an unhandled case where there are too many blocks between two
      // TransfersCommitted events and startBlockNumber is never defined. This should
      // never happen in production.
      if (!startBlockNumber) {
        logger.error('Too many blocks between two TransfersCommitted events')
        return
      }
    }

    let transferIds: string[] = []
    await sourceBridge.eventsBatch(
      async (start: number, end: number) => {
        let transferEvents = await sourceBridge.getTransferSentEvents(
          start,
          end
        )

        // transferEvents need to be sorted from [newest...oldest] in order to maintain the ordering
        transferEvents = transferEvents.reverse()
        for (let event of transferEvents) {
          const transaction = await sourceBridge.getTransaction(
            event.transactionHash
          )
          const { chainId } = await sourceBridge.decodeSendData(
            transaction.data
          )
          if (chainId !== destinationChainId) {
            continue
          }

          // When TransferSent and TransfersCommitted events exist in the same block, they
          // need to be scoped to the correct transferRoot
          if (startEvent && event.blockNumber === startEvent.blockNumber) {
            if (event.transactionIndex < startEvent.transactionIndex) {
              continue
            }
          }

          if (event.blockNumber === endEvent.blockNumber) {
            if (event.transactionIndex > endEvent.transactionIndex) {
              break
            }
          }

          transferIds.unshift(event.args.transferId)
        }
      },
      { startBlockNumber, endBlockNumber }
    )

    logger.debug(
      `found transfer ids for transfer root hash ${transferRootHash}\n`,
      transferIds
    )
    const tree = new MerkleTree(transferIds)
    const computedTransferRootHash = tree.getHexRoot()
    if (computedTransferRootHash !== transferRootHash) {
      logger.error(
        `computed transfer root hash doesn't match. Expected ${transferRootHash}, got ${computedTransferRootHash}`
      )
      return
    }

    await db.transferRoots.update(transferRootHash, {
      transferIds
    })

    return transferIds
  }

  handleMultipleWithdrawalsSettledEvent = async (
    bonder: string,
    transferRootHash: string,
    totalBondsSettled: BigNumber,
    transferIds: string[]
  ) => {
    let dbTransferRoot = await db.transferRoots.getByTransferRootHash(
      transferRootHash
    )
    for (let transferId of transferIds) {
      await db.transfers.update(transferId, {
        transferRootHash,
        withdrawalBondSettled: true
      })
    }
  }

  checkUnsettledTransfersFromDb = async () => {
    // only process transfer where this bridge is the destination chain
    const dbTransfers: Transfer[] = await db.transfers.getUnsettledBondedWithdrawalTransfers(
      {
        chainId: await this.bridge.getChainId()
      }
    )
    const filtered: Transfer[] = []
    for (let dbTransfer of dbTransfers) {
      const dbTransferRoot = await db.transferRoots.getByTransferRootHash(
        dbTransfer.transferRootHash
      )
      if (!dbTransferRoot) {
        this.logger.warn(
          `no db transfer root transfer id ${dbTransfer.transferId}`
        )
        continue
      }
      const ok =
        !!dbTransferRoot.chainId &&
        !!dbTransferRoot.totalAmount &&
        !!dbTransferRoot.confirmed &&
        !!dbTransferRoot.confirmTxHash &&
        !!dbTransferRoot.committed &&
        !!dbTransferRoot.committedAt
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
    }
    if (filtered.length) {
      this.logger.debug(
        `checking ${filtered.length} unsettled bonded withdrawal transfers db items`
      )
    }
    const promises: Promise<any>[] = []
    for (let dbTransfer of filtered) {
      promises.push(
        new Promise(async resolve => {
          try {
            await this.checkUnsettledTransfer(dbTransfer)
          } catch (err) {
            this.logger.error(`checkUnsettledTransfer error:`, err.message)
          }
          resolve(null)
        })
      )
    }

    await Promise.all(promises)
  }

  checkUnsettledTransfer = async (dbTransfer: Transfer) => {
    try {
      // TODO: move this check to db getter
      const dbTransferRoot = await db.transferRoots.getByTransferRootHash(
        dbTransfer.transferRootHash
      )
      const {
        transferRootHash: dbTransferRootHash,
        chainId: destinationChainId,
        totalAmount,
        confirmed,
        committed,
        committedAt,
        destinationBridgeAddress
      } = dbTransferRoot
      const transferIds: string[] = Object.values(
        dbTransferRoot.transferIds || []
      )

      const logger = this.logger.create({ root: dbTransferRootHash })
      const sourceBridge = this.bridge as L2Bridge
      const destBridge = this.getSiblingWatcherByChainId(destinationChainId)
        .bridge

      logger.debug(
        'transferRootId:',
        chalk.bgMagenta.black(dbTransfer.transferRootId)
      )

      const tree = new MerkleTree(transferIds)
      const transferRootHash = tree.getHexRoot()
      if (transferRootHash !== dbTransferRootHash) {
        logger.debug('transferIds:\n', transferIds)
        logger.error(
          `transfers computed transfer root hash doesn't match. Expected ${dbTransferRootHash}`
        )
        await db.transferRoots.update(dbTransferRootHash, {
          transferIds: []
        })
        return
      }

      const transferRootStruct = await destBridge.getTransferRoot(
        transferRootHash,
        totalAmount
      )

      const structTotalAmount = transferRootStruct.total
      const structAmountWithdrawn = transferRootStruct.amountWithdrawn
      const createdAt = Number(transferRootStruct?.createdAt.toString())
      if (createdAt === 0 || transferRootStruct.total.lte(0)) {
        // TODO: Figure out the best way to separate a transferRoot that was not set correctly and
        // one that has simply not yet been set
        logger.warn(
          `transferRoot has not yet been propagated after exit tx or was not set correctly`,
          `Total Amount: ${structTotalAmount.toString()}`,
          `Created At: ${createdAt}`
        )
        return
      }

      let totalBondsSettleAmount = BigNumber.from(0)
      for (let transferId of transferIds) {
        const { withdrawalBonder } = await db.transfers.getByTransferId(
          transferId
        )
        const transferBondAmount = await destBridge.getBondedWithdrawalAmountByBonder(
          withdrawalBonder,
          transferId
        )
        totalBondsSettleAmount = totalBondsSettleAmount.add(transferBondAmount)
      }

      if (totalBondsSettleAmount.eq(0)) {
        // logger.warn('totalBondsSettleAmount is 0. Cannot settle')
        return
      }

      if (this.shouldWaitMinThreshold) {
        let [credit, debit, bondedBondedWithdrawalsBalance] = await Promise.all(
          [
            destBridge.getCredit(),
            destBridge.getDebit(),
            destBridge.getBonderBondedWithdrawalsBalance()
          ]
        )

        const bonderDestBridgeStakedAmount = credit
          .sub(debit)
          .add(bondedBondedWithdrawalsBalance)

        if (
          totalBondsSettleAmount
            .div(bonderDestBridgeStakedAmount)
            .lt(BigNumber.from(this.minThresholdPercent * 100).div(100))
        ) {
          logger.warn(
            `total bonded withdrawal amount ${this.bridge.formatUnits(
              totalBondsSettleAmount
            )} does not meet min threshold of ${this.minThresholdPercent *
              100}% of total staked ${this.bridge.formatUnits(
              bonderDestBridgeStakedAmount
            )}. Cannot settle yet`
          )
          return
        }
      }

      logger.debug('committedAt:', committedAt)
      logger.debug('sourceChainId:', dbTransfer.sourceChainId)
      logger.debug('destinationChainId:', destinationChainId)
      logger.debug('computed transferRootHash:', transferRootHash)
      logger.debug('totalAmount:', this.bridge.formatUnits(totalAmount))
      logger.debug(
        'struct total amount:',
        this.bridge.formatUnits(structTotalAmount)
      )
      logger.debug(
        'struct withdrawnAmount:',
        this.bridge.formatUnits(structAmountWithdrawn)
      )
      logger.debug('struct createdAt:', createdAt)

      logger.debug('totalBondedSettleAmount:', createdAt)
      const newAmountWithdrawn = structAmountWithdrawn.add(
        totalBondsSettleAmount
      )
      logger.debug(
        'newAmountWithdrawn:',
        this.bridge.formatUnits(newAmountWithdrawn)
      )
      if (newAmountWithdrawn.gt(structTotalAmount)) {
        logger.warn('withdrawal exceeds transfer root total')
        return
      }

      for (let transferId of transferIds) {
        let dbTransfer = await db.transfers.getByTransferId(transferId)
        if (
          dbTransfer?.withdrawalBondSettleTxSentAt ||
          dbTransfer?.withdrawalBondSettled
        ) {
          const tenMinutes = 60 * 10 * 1000
          if (
            dbTransfer.withdrawalBondSettleTxSentAt + tenMinutes >
            Date.now()
          ) {
            logger.debug(
              'sent?:',
              !!dbTransfer.withdrawalBondSettleTxSentAt,
              'settled?:',
              !!dbTransfer.withdrawalBondSettled
            )
          }
          return
        }
      }

      logger.debug('transferIds:\n', transferIds)

      if (this.dryMode) {
        logger.warn('dry mode: skipping settleBondedWithdrawals transaction')
        return
      }

      for (let transferId of transferIds) {
        await db.transfers.update(transferId, {
          withdrawalBondSettleTxSentAt: Date.now()
        })
      }
      logger.debug('sending settle tx')
      const bonder = dbTransfer.withdrawalBonder
      const tx = await destBridge.settleBondedWithdrawals(
        bonder,
        transferIds,
        totalAmount
      )
      tx?.wait()
        .then(async (receipt: any) => {
          if (receipt.status !== 1) {
            for (let transferId of transferIds) {
              await db.transfers.update(transferId, {
                withdrawalBondSettleTxSentAt: Date.now()
              })
            }
            throw new Error('status=0')
          }
          this.emit('settleBondedWithdrawal', {
            transferRootHash,
            networkName: this.chainIdToSlug(destinationChainId),
            chainId: destinationChainId,
            transferId: dbTransfer.transferId
          })

          for (let transferId of transferIds) {
            await db.transfers.update(transferId, {
              transferRootHash,
              withdrawalBonded: true,
              withdrawalBondSettled: true,
              withdrawalBondedTxHash: receipt.transactionHash
            })
          }
        })
        .catch(async (err: Error) => {
          await db.transfers.update(dbTransfer.transferId, {
            withdrawalBondSettleTxSentAt: 0
          })

          throw err
        })
      logger.info(
        `settleBondedWithdrawals on chainId:${destinationChainId} tx: ${chalk.bgYellow.black.bold(
          tx.hash
        )}`
      )
      this.notifier.info(
        `settleBondedWithdrawals on chainId:${destinationChainId} tx: ${tx.hash}`
      )
    } catch (err) {
      if (err.message !== 'cancelled') {
        this.logger.error(`settleBondedWithdrawal error:`, err.message)
        this.notifier.error(`settleBondedWithdrawal error: ${err.message}`)
      }
      await db.transfers.update(dbTransfer.transferId, {
        withdrawalBondSettleTxSentAt: 0
      })
    }
  }

  async waitTimeout (transferId: string, chainId: number) {
    await wait(2 * 1000)
    if (!this.order()) {
      return
    }
    this.logger.debug(
      `waiting for settle bonded withdrawal event. transferId: ${transferId} chainId: ${chainId}`
    )
    const bridge = this.getSiblingWatcherByChainId(chainId).bridge
    let timeout = this.order() * BONDER_ORDER_DELAY_MS
    while (timeout > 0) {
      if (!this.started) {
        return
      }

      // TODO
      break

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
