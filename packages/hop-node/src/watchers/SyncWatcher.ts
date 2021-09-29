import BaseWatcher from './classes/BaseWatcher'
import L1Bridge from './classes/L1Bridge'
import L2Bridge from './classes/L2Bridge'
import MerkleTree from 'src/utils/MerkleTree'
import S3Upload from 'src/aws/s3Upload'
import chalk from 'chalk'
import getBlockNumberFromDate from 'src/utils/getBlockNumberFromDate'
import isL1ChainId from 'src/utils/isL1ChainId'
import wait from 'src/utils/wait'
import { BigNumber, Contract } from 'ethers'
import { Chain, TenMinutesMs } from 'src/constants'
import { DateTime } from 'luxon'
import { Event } from 'src/types'
import { Transfer } from 'src/db/TransfersDb'
import { boundClass } from 'autobind-decorator'
import { config as globalConfig, oruChains } from 'src/config'

type S3JsonData = {
  [token: string]: {
    availableCredit: {[chain: string]: string},
    pendingAmounts: {[chain: string]: string},
    unbondedTransferRootAmounts: {[chain: string]: string}
  }
}

const s3JsonData: S3JsonData = {}

export interface Config {
  chainSlug: string
  tokenSymbol: string
  label: string
  isL1: boolean
  bridgeContract: Contract
  syncFromDate?: string
  s3Upload?: boolean
  s3Namespace?: string
}

@boundClass
class SyncWatcher extends BaseWatcher {
  initialSyncCompleted: boolean = false
  resyncIntervalMs: number = 60 * 1000
  incompletePollerIntervalMs: number = 10 * 1000
  syncIndex: number = 0
  syncFromDate : string
  customStartBlockNumber : number
  ready: boolean = false
  private s3AvailableCredit: { [destinationChain: string]: BigNumber } = {} // bonder from core package config
  private availableCredit: { [destinationChain: string]: BigNumber } = {} // own bonder
  private pendingAmounts: { [destinationChain: string]: BigNumber } = {}
  private unbondedTransferRootAmounts: { [destinationChain: string]: BigNumber } = {}
  private lastCalculated: { [destinationChain: string]: number } = {}
  s3Upload: S3Upload
  s3Namespace: S3Upload

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
    if (config.s3Upload) {
      this.s3Upload = new S3Upload({
        bucket: 'assets.hop.exchange',
        key: `${config.s3Namespace || globalConfig.network}/v1-available-liquidity.json`
      })
    }
    this.init()
      .catch(err => {
        this.logger.error('init error:', err)
        this.quit()
      })
  }

  async init () {
    if (this.syncFromDate) {
      const date = DateTime.fromISO(this.syncFromDate)
      const timestamp = date.toSeconds()
      this.customStartBlockNumber = await getBlockNumberFromDate(this.chainSlug, timestamp)
    }
    this.ready = true
  }

  async start () {
    this.started = true
    try {
      await this.pollSync()
      await this.incompletePollSync()
    } catch (err) {
      this.logger.error(`sync watcher error: ${err.message}\ntrace: ${err.stack}`)
      this.notifier.error(`sync watcher error: ${err.message}`)
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

  async incompletePollSync () {
    while (true) {
      if (!(this.ready && this.isInitialSyncCompleted())) {
        await wait(5 * 1000)
        continue
      }
      try {
        const promises : Promise<any>[] = []
        const incompleteTransfers = await this.db.transfers.getIncompleteItems()
        for (const { transferId } of incompleteTransfers) {
          promises.push(this.populateTransferDbItem(transferId).catch(err => {
            this.logger.error(`populateTransferDbItem error: ${err.message}`)
            this.notifier.error(`populateTransferDbItem error: ${err.message}`)
          }))
        }
        const incompleteRoots = await this.db.transferRoots.getIncompleteItems()
        for (const { transferRootHash } of incompleteRoots) {
          promises.push(this.populateTransferRootDbItem(transferRootHash).catch(err => {
            this.logger.error(`populateTransferRootDbItem error: ${err.message}`)
            this.notifier.error(`populateTransferRootDbItem error: ${err.message}`)
          }))
        }

        await Promise.all(promises)
      } catch (err) {
        this.logger.error(`incomplete poll sync watcher error: ${err.message}\ntrace: ${err.stack}`)
        this.notifier.error(`incomplete poll sync watcher error: ${err.message}`)
      }
      await wait(this.incompletePollerIntervalMs)
    }
  }

  async preSyncHandler () {
    this.logger.debug('syncing up events. index:', this.syncIndex)
  }

  async postSyncHandler () {
    this.logger.debug('done syncing. index:', this.syncIndex)
    this.initialSyncCompleted = true
    this.syncIndex++
    try {
      await this.uploadToS3()
    } catch (err) {
      this.logger.error(err)
    }
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

    // these must come after db is done syncing,
    // and syncAvailableCredit must be last
    await Promise.all(promises)
      .then(() => this.syncUnbondedTransferRootAmounts())
      .then(() => this.syncPendingAmounts())
      .then(() => this.syncAvailableCredit())
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
      const destinationChainId = Number(destinationChainIdBn.toString())
      const sourceChainId = await this.bridge.getChainId()
      const isBondable = this.getIsBondable(transferId, amountOutMin, deadline, destinationChainId)

      logger.debug('transfer event amount:', this.bridge.formatUnits(amount))
      logger.debug('destinationChainId:', destinationChainId)
      logger.debug('isBondable:', isBondable)
      logger.debug('transferId:', chalk.bgCyan.black(transferId))
      logger.debug('bonderFee:', this.bridge.formatUnits(bonderFee))

      if (!isBondable) {
        logger.warn('transfer is unbondable', amountOutMin, deadline)
      }

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
    const { transactionHash } = event
    const { transferId, amount } = event.args
    const logger = this.logger.create({ id: transferId })

    logger.debug('handling WithdrawalBonded event')
    logger.debug('transferId:', transferId)
    logger.debug('amount:', this.bridge.formatUnits(amount))

    await this.db.transfers.update(transferId, {
      withdrawalBonded: true,
      withdrawalBondedTxHash: transactionHash
    })
  }

  async handleTransferRootConfirmedEvent (event: Event) {
    const {
      originChainId: sourceChainId,
      destinationChainId,
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
    const { transactionHash, blockNumber } = event
    const { root, amount } = event.args
    const logger = this.logger.create({ root })
    logger.debug('handling TransferRootBonded event')

    try {
      const bondTransferRootId = await this.bridge.getTransferRootId(
        root,
        amount
      )

      logger.debug(`transferRootHash from event: ${root}`)
      logger.debug(`event transactionHash: ${transactionHash}`)
      logger.debug(`event blockNumber: ${blockNumber}`)
      logger.debug(`bondAmount: ${this.bridge.formatUnits(amount)}`)
      logger.debug(`bondTransferRootId: ${bondTransferRootId}`)

      await this.db.transferRoots.update(root, {
        transferRootHash: root,
        bonded: true,
        bondTotalAmount: amount,
        bondTxHash: transactionHash,
        bondBlockNumber: blockNumber,
        bondTransferRootId
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
      const { transactionHash, blockNumber } = event
      const sourceChainId = await this.bridge.getChainId()
      const destinationChainId = Number(destinationChainIdBn.toString())
      const transferRootId = await this.bridge.getTransferRootId(
        transferRootHash,
        totalAmount
      )

      const sourceChainSlug = this.chainIdToSlug(sourceChainId)
      const shouldBondTransferRoot = oruChains.includes(sourceChainSlug)

      logger.debug('transfeRootId:', transferRootId)
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
    let startEvent: Event
    let endEvent: Event

    let startBlockNumber = sourceBridge.bridgeDeployedBlockNumber
    await sourceBridge.eventsBatch(async (start: number, end: number) => {
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
    const { transactionHash, blockNumber } = event

    logger.debug('handling TransferRootSet event')
    logger.debug(`transferRootHash from event: ${transferRootHash}`)
    logger.debug(`bondAmount: ${this.bridge.formatUnits(totalAmount)}`)
    logger.debug(`event transactionHash: ${transactionHash}`)

    await this.db.transferRoots.update(transferRootHash, {
      rootSetTxHash: transactionHash,
      rootSetBlockNumber: blockNumber
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
    const tx = await this.bridge.getTransaction(transactionHash)
    if (!tx) {
      throw new Error(`expected tx object. transactionHash: ${transactionHash}`)
    }
    const { data } = tx
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
    const rootAmountAllSettled = dbTransferRoot ? dbTransferRoot?.totalAmount?.eq(totalBondsSettled) : false
    const allTransfersSettled = dbTransfers.every(
      (dbTransfer: Transfer) => dbTransfer?.withdrawalBondSettled
    )
    const allSettled = rootAmountAllSettled || allTransfersSettled
    logger.debug(`all settled: ${allSettled}`)
    await this.db.transferRoots.update(transferRootHash, {
      allSettled
    })
  }

  async populateTransferDbItem (transferId: string) {
    const dbTransfer = await this.db.transfers.getByTransferId(transferId)
    if (!dbTransfer) {
      throw new Error('expected db transfer item')
    }
    const logger = this.logger.create({ id: transferId })
    const { transferSentTimestamp, transferSentBlockNumber, withdrawalBondedTxHash, withdrawalBonder } = dbTransfer
    if (transferSentBlockNumber && !transferSentTimestamp) {
      const transferSentTimestamp = await this.bridge.getBlockTimestamp(transferSentBlockNumber)
      logger.debug(`transferSentTimestamp: ${transferSentTimestamp}`)
      await this.db.transfers.update(transferId, {
        transferSentTimestamp
      })
    }

    if (withdrawalBondedTxHash && !withdrawalBonder) {
      const tx = await this.bridge.getTransaction(withdrawalBondedTxHash)
      if (!tx) {
        throw new Error(`expected tx object. transferId: ${transferId}`)
      }
      const { from: withdrawalBonder } = tx
      logger.debug(`withdrawalBonder: ${withdrawalBonder}`)
      await this.db.transfers.update(transferId, {
        withdrawalBonder
      })
    }
  }

  async populateTransferRootDbItem (transferRootHash: string) {
    const dbTransferRoot = await this.db.transferRoots.getByTransferRootHash(transferRootHash)
    if (!dbTransferRoot) {
      throw new Error('expected db transfer root item')
    }
    const logger = this.logger.create({ root: transferRootHash })
    const { transferRootId, totalAmount, bondTxHash, bondBlockNumber, bondTotalAmount, bonder, bondedAt, rootSetBlockNumber, rootSetTimestamp } = dbTransferRoot

    if (bondTxHash && (!bonder || !bondedAt)) {
      const tx = await this.bridge.getTransaction(bondTxHash)
      if (!tx) {
        throw new Error(`expected tx object. transactionHash: ${bondTxHash}`)
      }
      const { from: bonder } = tx
      const bondedAt = await this.bridge.getBlockTimestamp(bondBlockNumber)

      logger.debug(`bonder: ${bonder}`)
      logger.debug(`bondedAt: ${bondedAt}`)

      await this.db.transferRoots.update(transferRootHash, {
        bonder,
        bondedAt
      })
    }

    if (rootSetBlockNumber && !rootSetTimestamp) {
      const rootSetTimestamp = await this.bridge.getBlockTimestamp(rootSetBlockNumber)
      const transferRootId = await this.bridge.getTransferRootId(
        transferRootHash,
        totalAmount
      )
      logger.debug(`transferRootId: ${transferRootId}`)
      logger.debug(`rootSetTimestamp: ${rootSetTimestamp}`)
      await this.db.transferRoots.update(transferRootHash, {
        rootSetTimestamp
      })
    }
  }

  getIsBondable = (
    transferId: string,
    amountOutMin: BigNumber,
    deadline: number,
    destinationChainId: number
  ): boolean => {
    // Remove when this hash has been resolved
    const invalidTransferIds: string[] = [
      '0x99b304c55afc0b56456dc4999913bafff224080b8a3bbe0e5a04aaf1eedf76b6'
    ]
    if (invalidTransferIds.includes(transferId)) {
      return false
    }

    const attemptSwap = this.bridge.shouldAttemptSwap(amountOutMin, deadline)
    if (attemptSwap && isL1ChainId(destinationChainId)) {
      return false
    }

    return true
  }

  isOruToL1 (destinationChainId: number) {
    const sourceChain = this.chainSlug
    const destinationChain = this.chainIdToSlug(destinationChainId)
    return destinationChain === Chain.Ethereum && oruChains.includes(sourceChain)
  }

  isNonOruToL1 (destinationChainId: number) {
    const sourceChain = this.chainSlug
    const destinationChain = this.chainIdToSlug(destinationChainId)
    return destinationChain === Chain.Ethereum && !oruChains.includes(sourceChain)
  }

  // ORU -> L1: (credit - debit - OruToL1PendingAmount - OruToAllUnbondedTransferRoots) / 2
  //    - divide by 2 because `amount` gets added to OruToL1PendingAmount
  //    - the divide by 2 happens upstream
  // nonORU -> L1: (credit - debit - OruToL1PendingAmount - OruToAllUnbondedTransferRoots)
  // L2 -> L2: (credit - debit)
  private async calculateAvailableCredit (destinationChainId: number, bonder?: string) {
    const sourceChain = this.chainSlug
    const destinationChain = this.chainIdToSlug(destinationChainId)
    const destinationWatcher = this.getSiblingWatcherByChainSlug(destinationChain)
    if (!destinationWatcher) {
      throw new Error(`no destination watcher for ${destinationChain}`)
    }
    const destinationBridge = destinationWatcher.bridge
    let availableCredit = await destinationBridge.getBaseAvailableCredit(bonder)
    if (this.isOruToL1(destinationChainId) || this.isNonOruToL1(destinationChainId)) {
      const pendingAmount = await this.getOruToL1PendingAmount()
      availableCredit = availableCredit.sub(pendingAmount)

      const unbondedTransferRootAmounts = await this.getOruToAllUnbondedTransferRootAmounts()
      availableCredit = availableCredit.sub(unbondedTransferRootAmounts)
    }

    if (availableCredit.lt(0)) {
      return BigNumber.from(0)
    }

    return availableCredit
  }

  async calculatePendingAmount (destinationChainId: number) {
    const bridge = this.bridge as L2Bridge
    const pendingAmount = await bridge.getPendingAmountForChainId(destinationChainId)
    return pendingAmount
  }

  public async calculateUnbondedTransferRootAmounts (destinationChainId: number) {
    const transferRoots = await this.db.transferRoots.getUnbondedTransferRoots({
      sourceChainId: this.chainSlugToId(this.chainSlug),
      destinationChainId
    })
    let totalAmount = BigNumber.from(0)
    for (const transferRoot of transferRoots) {
      totalAmount = totalAmount.add(transferRoot.totalAmount)
    }

    return totalAmount
  }

  private async updateAvailableCreditMap (destinationChainId: number) {
    const availableCredit = await this.calculateAvailableCredit(destinationChainId)
    const destinationChain = this.chainIdToSlug(destinationChainId)
    this.availableCredit[destinationChain] = availableCredit

    if (this.s3Upload) {
      const bonder = globalConfig.bonders[this.tokenSymbol]?.[0]
      const availableCredit = await this.calculateAvailableCredit(destinationChainId, bonder)
      this.s3AvailableCredit[destinationChain] = availableCredit
    }
  }

  private async updatePendingAmountsMap (destinationChainId: number) {
    const pendingAmount = await this.calculatePendingAmount(destinationChainId)
    const destinationChain = this.chainIdToSlug(destinationChainId)
    this.pendingAmounts[destinationChain] = pendingAmount
  }

  private async updateUnbondedTransferRootAmountsMap (destinationChainId: number) {
    const totalAmounts = await this.calculateUnbondedTransferRootAmounts(destinationChainId)
    const destinationChain = this.chainIdToSlug(destinationChainId)
    this.unbondedTransferRootAmounts[destinationChain] = totalAmounts
    this.lastCalculated[destinationChain] = Date.now()
  }

  async syncPendingAmounts () {
    const pendingAmounts = BigNumber.from(0)
    const chains = await this.bridge.getChainIds()
    for (const destinationChainId of chains) {
      const destinationChain = this.chainIdToSlug(destinationChainId)
      if (
        this.chainSlug === Chain.Ethereum ||
        this.chainSlug === destinationChain
      ) {
        continue
      }
      await this.updatePendingAmountsMap(destinationChainId)
    }
  }

  async syncUnbondedTransferRootAmounts () {
    const chains = await this.bridge.getChainIds()
    for (const destinationChainId of chains) {
      const sourceChain = this.chainSlug
      const destinationChain = this.chainIdToSlug(destinationChainId)
      const shouldSkip = (
        sourceChain === Chain.Ethereum ||
        sourceChain === destinationChain ||
        !this.hasSiblingWatcher(destinationChainId)
      )
      if (shouldSkip) {
        continue
      }
      await this.updateUnbondedTransferRootAmountsMap(destinationChainId)
    }
  }

  private async syncAvailableCredit () {
    const chains = await this.bridge.getChainIds()
    for (const destinationChainId of chains) {
      const sourceChain = this.chainSlug
      const destinationChain = this.chainIdToSlug(destinationChainId)
      const shouldSkip = (
        sourceChain === Chain.Ethereum ||
        sourceChain === destinationChain ||
        !this.hasSiblingWatcher(destinationChainId)
      )
      if (shouldSkip) {
        continue
      }
      await this.updateAvailableCreditMap(destinationChainId)
      const availableCredit = await this.getEffectiveAvailableCredit(destinationChainId)
      this.logger.debug(`availableCredit (${this.tokenSymbol} ${sourceChain}→${destinationChain}): ${this.bridge.formatUnits(availableCredit)}`)
    }
  }

  async getOruToL1PendingAmount () {
    let pendingAmounts = BigNumber.from(0)
    for (const chain of oruChains) {
      const watcher = this.getSiblingWatcherByChainSlug(chain)
      if (!watcher) {
        continue
      }

      const destinationChainId = this.chainSlugToId(Chain.Ethereum)
      const pendingAmount = await watcher.calculatePendingAmount(destinationChainId)
      pendingAmounts = pendingAmounts.add(pendingAmount)
    }

    return pendingAmounts
  }

  async getOruToAllUnbondedTransferRootAmounts () {
    let totalAmount = BigNumber.from(0)
    for (const destinationChain in this.unbondedTransferRootAmounts) {
      if (this.lastCalculated[destinationChain]) {
        const isStale = Date.now() - this.lastCalculated[destinationChain] > TenMinutesMs
        if (isStale) {
          continue
        }
      }
      const amount = this.unbondedTransferRootAmounts[destinationChain]
      totalAmount = totalAmount.add(amount)
    }
    return totalAmount
  }

  public async getEffectiveAvailableCredit (destinationChainId: number) {
    const sourceChain = this.chainSlug
    const destinationChain = this.chainIdToSlug(destinationChainId)
    const availableCredit = this.availableCredit[destinationChain]
    if (!availableCredit) {
      return BigNumber.from(0)
    }

    return availableCredit
  }

  async uploadToS3 () {
    if (!this.s3Upload) {
      return
    }

    const data : any = {
      availableCredit: {},
      pendingAmounts: {},
      unbondedTransferRootAmounts: {}
    }
    for (const chainId in this.siblingWatchers) {
      const sourceChain = this.chainIdToSlug(Number(chainId))
      const watcher = this.siblingWatchers[chainId]
      const shouldSkip = (
        sourceChain === Chain.Ethereum
      )
      if (shouldSkip) {
        continue
      }
      data.availableCredit[sourceChain] = watcher.s3AvailableCredit
      data.pendingAmounts[sourceChain] = watcher.pendingAmounts
      data.unbondedTransferRootAmounts[sourceChain] = watcher.unbondedTransferRootAmounts
    }

    s3JsonData[this.tokenSymbol] = data
    await this.s3Upload.upload(s3JsonData)
  }
}

export default SyncWatcher
