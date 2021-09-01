import BaseWatcher from './classes/BaseWatcher'
import L1Bridge from './classes/L1Bridge'
import L2Bridge from './classes/L2Bridge'
import MerkleTree from 'src/utils/MerkleTree'
import chalk from 'chalk'
import getBlockNumberFromDate from 'src/utils/getBlockNumberFromDate'
import { BigNumber, Contract } from 'ethers'
import { Chain } from 'src/constants'
import { DateTime } from 'luxon'
import { Event } from 'src/types'
import { Transfer } from 'src/db/TransfersDb'
import { boundClass } from 'autobind-decorator'
import { isL1ChainId, wait } from 'src/utils'

export interface Config {
  chainSlug: string
  tokenSymbol: string
  label: string
  isL1: boolean
  bridgeContract: Contract
  syncFromDate?: string
}

@boundClass
class SyncWatcher extends BaseWatcher {
  initialSyncCompleted: boolean = false
  resyncIntervalMs: number = 60 * 1000
  syncIndex: number = 0
  syncFromDate : string
  customStartBlockNumber : number
  ready: boolean = false
  readonly bondableChains: string[] = [Chain.Optimism, Chain.Arbitrum]

  constructor (config: Config) {
    super({
      chainSlug: config.chainSlug,
      tokenSymbol: config.tokenSymbol,
      tag: 'SyncWatcher',
      prefix: config.label,
      logColor: 'gray',
      isL1: config.isL1,
      bridgeContract: config.bridgeContract
    })
    this.syncFromDate = config.syncFromDate
    this.init()
      .catch(err => {
        this.logger.error('init error', err)
        this.quit()
      })
  }

  async init () {
    if (this.syncFromDate) {
      const date = DateTime.fromISO(this.syncFromDate)
      const timestamp = date.toSeconds()
      this.customStartBlockNumber = await getBlockNumberFromDate(this.chainSlug, timestamp)
      this.ready = true
    } else {
      this.ready = true
    }
  }

  async start () {
    this.started = true
    try {
      await this.pollSync()
    } catch (err) {
      this.logger.error('sync watcher error:', err.message)
      this.notifier.error(`sync watcher error: '${err.message}`)
      console.trace()
      this.quit()
    }
  }

  async pollSync () {
    while (true) {
      if (!this.ready) {
        await wait(5 * 1000)
        continue
      }
      await this.preSyncHandler()
      await this.syncHandler()
      await this.postSyncHandler()
    }
  }

  async preSyncHandler () {
    this.logger.debug('syncing up events. index:', this.syncIndex)
  }

  async postSyncHandler () {
    this.logger.debug('done syncing. index:', this.syncIndex)
    this.initialSyncCompleted = true
    this.syncIndex++
    await wait(this.resyncIntervalMs)
  }

  isInitialSyncCompleted (): boolean {
    return this.initialSyncCompleted
  }

  isAllSiblingWatchersInitialSyncCompleted (): boolean {
    return Object.values(this.siblingWatchers).every(
      (siblingWatcher: SyncWatcher) => {
        return siblingWatcher.isInitialSyncCompleted()
      }
    )
  }

  async syncHandler (): Promise<any> {
    const promises: Promise<any>[] = []
    let startBlockNumber = this.bridge.bridgeDeployedBlockNumber
    let useCacheKey = true

    // if it is first sync upon start and
    // custom start block was specified,
    // then use that as initial start block
    if (!this.isInitialSyncCompleted() && this.customStartBlockNumber) {
      useCacheKey = false
      startBlockNumber = this.customStartBlockNumber
    }

    const getOptions = (keyName: string) => {
      return {
        cacheKey: useCacheKey ? this.cacheKey(keyName) : undefined,
        startBlockNumber
      }
    }

    if (this.isL1) {
      const l1Bridge = this.bridge as L1Bridge
      promises.push(
        l1Bridge.mapTransferRootBondedEvents(
          async (event: Event) => {
            return this.handleTransferRootBondedEvent(event)
          },
          getOptions(l1Bridge.TransferRootBonded)
        )
      )

      promises.push(
        l1Bridge.mapTransferRootConfirmedEvents(
          async (event: Event) => {
            return this.handleTransferRootConfirmedEvent(event)
          },
          getOptions(l1Bridge.TransferRootConfirmed)
        )
      )

      promises.push(
        l1Bridge.mapTransferBondChallengedEvents(
          async (event: Event) => {
            return this.handleTransferBondChallengedEvent(event)
          },
          getOptions(l1Bridge.TransferBondChallenged)
        )
      )
    }

    if (!this.isL1) {
      const l2Bridge = this.bridge as L2Bridge
      promises.push(
        l2Bridge.mapTransferSentEvents(
          async (event: Event) => {
            return this.handleTransferSentEvent(event)
          },
          getOptions(l2Bridge.TransferSent)
        )
      )

      promises.push(
        l2Bridge.mapTransfersCommittedEvents(
          async (event: Event) => {
            return Promise.all([
              this.handleTransfersCommittedEvent(event),
              this.handleTransfersCommittedEventForTransferIds(event)
            ])
          },
          getOptions(l2Bridge.TransfersCommitted)
        )
      )
    }

    promises.push(
      this.bridge.mapWithdrawalBondedEvents(
        async (event: Event) => {
          return this.handleWithdrawalBondedEvent(event)
        },
        getOptions(this.bridge.WithdrawalBonded)
      )
        .then(() => {
        // This must be executed after the WithdrawalBonded event handler on initial sync
        // since it relies on data from that handler.
          return this.bridge.mapMultipleWithdrawalsSettledEvents(
            async (event: Event) => {
              return this.handleMultipleWithdrawalsSettledEvent(event)
            },
            getOptions(this.bridge.MultipleWithdrawalsSettled)
          )
        })
    )

    promises.push(
      this.bridge.mapTransferRootSetEvents(
        async (event: Event) => {
          return this.handleTransferRootSetEvent(event)
        },
        getOptions(this.bridge.TransferRootSet)
      )
    )

    await Promise.all(promises)
  }

  async handleTransferSentEvent (event: Event) {
    const {
      transferId,
      chainId: destinationChainIdBn,
      recipient,
      amount,
      transferNonce,
      bonderFee,
      index,
      amountOutMin,
      deadline
    } = event.args
    const logger = this.logger.create({ id: transferId })
    logger.debug('handling TransferSent event')

    try {
      const { transactionHash, transactionIndex } = event
      const blockNumber: number = event.blockNumber
      if (!transactionHash) {
        throw new Error('event transaction hash not found')
      }
      if (!blockNumber) {
        throw new Error('event block number not found')
      }
      const l2Bridge = this.bridge as L2Bridge
      const destinationChainId = Number(destinationChainIdBn.toString())
      const sourceChainId = await l2Bridge.getChainId()
      const isBondable = this.getIsBondable(amount, transferId)

      logger.debug('transfer event amount:', this.bridge.formatUnits(amount))
      logger.debug('destinationChainId:', destinationChainId)
      logger.debug('isBondable:', isBondable)
      logger.debug('transferId:', chalk.bgCyan.black(transferId))
      logger.debug('bonderFee:', this.bridge.formatUnits(bonderFee))

      await this.db.transfers.update(transferId, {
        transferId,
        destinationChainId,
        sourceChainId,
        recipient,
        amount,
        transferNonce,
        bonderFee,
        amountOutMin,
        isBondable,
        deadline: Number(deadline.toString()),
        transferSentTxHash: transactionHash,
        transferSentBlockNumber: blockNumber,
        transferSentIndex: transactionIndex
      })
    } catch (err) {
      logger.error(`handleTransferSentEvent error: ${err.message}`)
      this.notifier.error(`handleTransferSentEvent error: ${err.message}`)
    }
  }

  async handleWithdrawalBondedEvent (event: Event) {
    const { transferId, amount } = event.args
    const logger = this.logger.create({ id: transferId })

    const { transactionHash } = event
    const tx = await this.bridge.getTransaction(transactionHash)
    const { from: withdrawalBonder } = tx

    logger.debug('handling WithdrawalBonded event')
    logger.debug('transferId:', transferId)
    logger.debug('amount:', this.bridge.formatUnits(amount))

    await this.db.transfers.update(transferId, {
      withdrawalBonded: true,
      withdrawalBonder,
      withdrawalBondedTxHash: transactionHash
    })
  }

  async handleTransferRootConfirmedEvent (event: Event) {
    const {
      originChainId: sourceChainId,
      destinationChainId: destChainId,
      rootHash: transferRootHash,
      totalAmount
    } = event.args
    const logger = this.logger.create({ root: transferRootHash })
    logger.debug('handling TransferRootConfirmed event')

    try {
      const { transactionHash } = event
      await this.db.transferRoots.update(transferRootHash, {
        confirmed: true,
        confirmTxHash: transactionHash
      })
    } catch (err) {
      logger.error(`handleTransferRootConfirmedEvent error: ${err.message}`)
      this.notifier.error(
        `handleTransferRootConfirmedEvent error: ${err.message}`
      )
    }
  }

  async handleTransferRootBondedEvent (event: Event) {
    const { root, amount } = event.args
    const logger = this.logger.create({ root: root })
    logger.debug('handling TransferRootBonded event')

    try {
      const { transactionHash } = event
      const tx = await this.bridge.getTransaction(transactionHash)
      const { from: bonder } = tx
      const transferRootId = await this.bridge.getTransferRootId(
        root,
        amount
      )
      const timestamp = await this.bridge.getEventTimestamp(event)

      logger.debug(`transferRootHash from event: ${root}`)
      logger.debug(`bondAmount: ${this.bridge.formatUnits(amount)}`)
      logger.debug(`transferRootId: ${transferRootId}`)
      logger.debug(`event transactionHash: ${transactionHash}`)
      logger.debug(`bonder: ${bonder}`)

      await this.db.transferRoots.update(root, {
        transferRootHash: root,
        bonded: true,
        bonder,
        bondTotalAmount: amount,
        bondTxHash: transactionHash,
        bondedAt: timestamp,
        bondTransferRootId: transferRootId
      })
    } catch (err) {
      logger.error(`handleTransferRootBondedEvent error: ${err.message}`)
      this.notifier.error(`handleTransferRootBondedEvent error: ${err.message}`)
    }
  }

  async handleTransfersCommittedEvent (event: Event) {
    const {
      destinationChainId: destinationChainIdBn,
      rootHash: transferRootHash,
      totalAmount,
      rootCommittedAt: committedAtBn
    } = event.args
    const logger = this.logger.create({ root: transferRootHash })
    logger.debug('handling TransfersCommitted event')

    try {
      const committedAt = Number(committedAtBn.toString())
      const { transactionHash } = event
      const l2Bridge = this.bridge as L2Bridge

      const sourceChainId = await l2Bridge.getChainId()
      const destinationChainId = Number(destinationChainIdBn.toString())
      let destinationBridgeAddress: string
      const isExitWatcher = !this.hasSiblingWatcher(destinationChainId)
      if (!isExitWatcher) {
        destinationBridgeAddress = await this.getSiblingWatcherByChainId(
          destinationChainId
        ).bridge.getAddress()
      }
      const transferRootId = await this.bridge.getTransferRootId(
        transferRootHash,
        totalAmount
      )
      const blockNumber: number = event.blockNumber

      const sourceChainSlug = this.chainIdToSlug(sourceChainId)
      const shouldBondTransferRoot = this.bondableChains.includes(sourceChainSlug)

      logger.debug('committedAt:', committedAt)
      logger.debug('totalAmount:', this.bridge.formatUnits(totalAmount))
      logger.debug('transferRootHash:', transferRootHash)
      logger.debug('destinationChainId:', destinationChainId)
      logger.debug('shouldBondTransferRoot:', shouldBondTransferRoot)

      await this.db.transferRoots.update(transferRootHash, {
        transferRootHash,
        transferRootId,
        totalAmount,
        committedAt,
        destinationChainId,
        destinationBridgeAddress,
        sourceChainId,
        committed: true,
        commitTxHash: transactionHash,
        commitTxBlockNumber: blockNumber,
        shouldBondTransferRoot
      })
    } catch (err) {
      logger.error(`handleTransfersCommittedEvent error: ${err.message}`)
      this.notifier.error(`handleTransfersCommittedEvent error: ${err.message}`)
    }
  }

  async handleTransfersCommittedEventForTransferIds (event: Event) {
    const {
      destinationChainId: destinationChainIdBn,
      rootHash: transferRootHash,
      totalAmount,
      rootCommittedAt: committedAtBn
    } = event.args
    const logger = this.logger.create({ root: transferRootHash })
    logger.debug('handling TransfersCommitted event for transfer IDs')

    const sourceChainId = await this.bridge.getChainId()
    const destinationChainId = Number(destinationChainIdBn.toString())
    await this.db.transferRoots.update(transferRootHash, {
      sourceChainId,
      destinationChainId
    })

    if (isL1ChainId(sourceChainId)) {
      return
    }
    logger.debug(
      `looking for transfer ids for transferRootHash ${transferRootHash}`
    )
    if (!this.hasSiblingWatcher(sourceChainId)) {
      logger.error(`no sibling watcher found for ${sourceChainId}`)
      return
    }
    const sourceBridge = this.getSiblingWatcherByChainId(sourceChainId)
      .bridge as L2Bridge

    const eventBlockNumber: number = event.blockNumber
    let startSearchBlockNumber: number
    let startEvent: Event
    let endEvent: Event

    let startBlockNumber = sourceBridge.bridgeDeployedBlockNumber
    await sourceBridge.eventsBatch(async (start: number, end: number) => {
      startSearchBlockNumber = start
      let events = await sourceBridge.getTransfersCommittedEvents(start, end)
      if (!events?.length) {
        return true
      }

      // events need to be sorted from [newest...oldest] in order to pick up the endEvent first
      events = events.reverse()
      for (const event of events) {
        if (event.args.rootHash === transferRootHash) {
          endEvent = event
          continue
        }

        const eventDestinationChainId = Number(event.args.destinationChainId.toString())
        const isSameChainId = eventDestinationChainId === destinationChainId
        if (endEvent && isSameChainId) {
          startEvent = event
          return false
        }
      }

      return true
    },
    { endBlockNumber: eventBlockNumber, startBlockNumber }
    )

    if (!endEvent) {
      return
    }

    const endBlockNumber = endEvent.blockNumber
    if (startEvent) {
      startBlockNumber = startEvent.blockNumber
    }

    logger.debug(`Searching for transfers between ${startBlockNumber} and ${endBlockNumber}`)

    const transfers: any[] = []
    await sourceBridge.eventsBatch(
      async (start: number, end: number) => {
        let transferEvents = await sourceBridge.getTransferSentEvents(
          start,
          end
        )

        // transferEvents need to be sorted from [newest...oldest] in order to maintain the ordering
        transferEvents = transferEvents.reverse()
        for (const event of transferEvents) {
          const transaction = await sourceBridge.getTransaction(
            event.transactionHash
          )
          const eventDestinationChainId = Number(event.args.chainId.toString())
          const isSameChainId = eventDestinationChainId === destinationChainId
          if (!isSameChainId) {
            continue
          }

          // TransferSent events must be handled differently when they exist in the
          // same block or same transaction as a TransfersCommitted event
          if (startEvent && event.blockNumber === startEvent.blockNumber) {
            if (event.transactionIndex < startEvent.transactionIndex) {
              continue
            }
          }

          if (event.blockNumber === endEvent.blockNumber) {
            // If TransferSent is in the same tx as TransfersCommitted or later,
            // the transferId should be included in the next transferRoot
            if (event.transactionIndex >= endEvent.transactionIndex) {
              continue
            }
          }

          transfers.unshift({
            transferId: event.args.transferId,
            index: Number(event.args.index.toString())
          })
        }
      },
      { startBlockNumber, endBlockNumber }
    )

    logger.debug(`Original transfer ids: ${JSON.stringify(transfers)}}`)

    // this gets only the last set of sequence of transfers {0, 1,.., n}
    // where n is the transfer id index.
    // example: {0, 0, 1, 2, 3, 4, 5, 6, 7, 0, 0, 1, 2, 3} ⟶  {0, 1, 2, 3}
    const lastIndexZero = transfers.map((x: any) => x.index).lastIndexOf(0)
    const filtered = transfers.slice(lastIndexZero)
    const transferIds = filtered.map((x: any) => x.transferId)

    const tree = new MerkleTree(transferIds)
    const computedTransferRootHash = tree.getHexRoot()
    if (computedTransferRootHash !== transferRootHash) {
      logger.error(
        `computed transfer root hash doesn't match. Expected ${transferRootHash}, got ${computedTransferRootHash}. List: ${JSON.stringify(transferIds)}`
      )
      return
    }

    logger.debug(
      `found transfer ids for transfer root hash ${transferRootHash}`,
      JSON.stringify(transferIds)
    )

    const transferRootId = await this.bridge.getTransferRootId(
      transferRootHash,
      totalAmount
    )

    await this.db.transferRoots.update(transferRootHash, {
      transferIds,
      totalAmount,
      sourceChainId
    })

    for (const transferId of transferIds) {
      await this.db.transfers.update(transferId, {
        transferRootHash,
        transferRootId
      })
    }
  }

  handleTransferBondChallengedEvent = async (event: Event) => {
    const {
      transferRootId,
      rootHash,
      originalAmount
    } = event.args
    const logger = this.logger.create({ root: rootHash })
    const { transactionHash } = event

    logger.debug('handling TransferBondChallenged event')
    logger.debug(`transferRootId: ${transferRootId}`)
    logger.debug(`rootHash: ${rootHash}`)
    logger.debug(`originalAmount: ${this.bridge.formatUnits(originalAmount)}`)
    logger.debug(`event transactionHash: ${transactionHash}`)

    await this.db.transferRoots.update(rootHash, {
      challenged: true
    })
  }

  handleTransferRootSetEvent = async (event: Event) => {
    const {
      rootHash: transferRootHash,
      totalAmount
    } = event.args
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
    await this.db.transferRoots.update(transferRootHash, {
      rootSetTxHash: transactionHash,
      rootSetTimestamp: timestamp
    })
  }

  handleMultipleWithdrawalsSettledEvent = async (event: Event) => {
    const {
      bonder,
      rootHash: transferRootHash,
      totalBondsSettled
    } = event.args
    const logger = this.logger.create({ root: transferRootHash })

    const { transactionHash } = event
    const { data } = await this.bridge.getTransaction(transactionHash)
    const { transferIds } = await this.bridge.decodeSettleBondedWithdrawalsData(
      data
    )

    logger.debug('handling MultipleWithdrawalsSettled event')
    logger.debug(`tx hash from event: ${transactionHash}`)
    logger.debug(`transferRootHash from event: ${transferRootHash}`)
    logger.debug(`bonder : ${bonder}`)
    logger.debug(`totalBondSettled: ${this.bridge.formatUnits(totalBondsSettled)}`)
    logger.debug(`transferIds count: ${transferIds.length}`)
    const dbTransfers : Transfer[] = []
    for (const transferId of transferIds) {
      const dbTransfer = await this.db.transfers.getByTransferId(transferId)
      if (!dbTransfer) {
        logger.warn(`transfer id ${transferId} db item not found`)
      }
      dbTransfers.push(dbTransfer)
      const withdrawalBondSettled = dbTransfer?.withdrawalBonded ?? false
      await this.db.transfers.update(transferId, {
        withdrawalBondSettled
      })
    }
    const dbTransferRoot = await this.db.transferRoots.getByTransferRootHash(transferRootHash)
    const rootAmountAllSettled = dbTransferRoot ? dbTransferRoot?.totalAmount.eq(totalBondsSettled) : false
    const allTransfersSettled = dbTransfers.every(
      (dbTransfer: Transfer) => dbTransfer?.withdrawalBondSettled
    )
    const allSettled = rootAmountAllSettled || allTransfersSettled
    logger.debug(`all settled: ${allSettled}`)
    if (allSettled) {
      await this.db.transferRoots.update(transferRootHash, {
        allSettled
      })
    }
  }

  getIsBondable = (amount: BigNumber, transferId: string): boolean => {
    if (
      (this.bridge.minBondWithdrawalAmount && amount.lt(this.bridge.minBondWithdrawalAmount)) ||
      (this.bridge.maxBondWithdrawalAmount && amount.gt(this.bridge.maxBondWithdrawalAmount))
    ) {
      return false
    }

    // Remove when this hash has been resolved
    const invalidTransferIds: string[] = [
      '0x99b304c55afc0b56456dc4999913bafff224080b8a3bbe0e5a04aaf1eedf76b6'
    ]
    if (invalidTransferIds.includes(transferId)) {
      return false
    }

    return true
  }
}

export default SyncWatcher
