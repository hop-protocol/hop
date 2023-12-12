import BaseWatcher from './classes/BaseWatcher'
import L1Bridge from './classes/L1Bridge'
import L2Bridge from './classes/L2Bridge'
import MerkleTree from 'src/utils/MerkleTree'
import getBlockNumberFromDate from 'src/utils/getBlockNumberFromDate'
import getRpcProvider from 'src/utils/getRpcProvider'
import getRpcRootProviderName from 'src/utils/getRpcRootProviderName'
import getRpcUrl from 'src/utils/getRpcUrl'
import getTransferSentToL2TransferId from 'src/utils/getTransferSentToL2TransferId'
import isL1ChainId from 'src/utils/isL1ChainId'
import wait from 'src/utils/wait'
import { BigNumber, Contract, EventFilter, providers } from 'ethers'
import {
  Chain,
  ChainPollMultiplier,
  DoesRootProviderSupportWs,
  FiveMinutesMs,
  GasCostTransactionType,
  OneWeekMs,
  RelayableChains,
  RootProviderName,
  TenMinutesMs
} from 'src/constants'
import { DateTime } from 'luxon'
import { GasCost } from 'src/db/GasCostDb'
import { GasCostEstimationRes } from './classes/Bridge'
import {
  L1_Bridge as L1BridgeContract,
  MultipleWithdrawalsSettledEvent,
  TransferBondChallengedEvent,
  TransferRootBondedEvent,
  TransferRootConfirmedEvent,
  TransferRootSetEvent,
  TransferSentToL2Event,
  WithdrawalBondSettledEvent,
  WithdrawalBondedEvent,
  WithdrewEvent
} from '@hop-protocol/core/contracts/generated/L1_Bridge'
import {
  L2_Bridge as L2BridgeContract,
  TransferSentEvent,
  TransfersCommittedEvent
} from '@hop-protocol/core/contracts/generated/L2_Bridge'
import { RelayerFee } from '@hop-protocol/sdk'
import {
  BondTransferRootChains,
  SyncCyclesPerFullSync,
  SyncIntervalMultiplier,
  SyncIntervalSec,
  getEnabledNetworks,
  config as globalConfig,
  minEthBonderFeeBn,
  wsEnabledChains
} from 'src/config'
import { Transfer } from 'src/db/TransfersDb'
import { TransferRoot } from 'src/db/TransferRootsDb'
import { getSortedTransferIds } from 'src/utils/getSortedTransferIds'
import { isDbSetReady } from 'src/db'
import { promiseQueue } from 'src/utils/promiseQueue'
import { promiseTimeout } from 'src/utils/promiseTimeout'

type Config = {
  chainSlug: string
  tokenSymbol: string
  bridgeContract: L1BridgeContract | L2BridgeContract
  syncFromDate?: string
  gasCostPollEnabled?: boolean
}

type EventPromise = Array<Promise<any>>

class SyncWatcher extends BaseWatcher {
  sourceChainInitialSyncCompleted: boolean = false
  initialSyncCompleted: boolean = false
  syncIntervalMs: number
  // Five minutes is granular enough. Any lower results in excessive redundant DB writes.
  gasCostPollMs: number = FiveMinutesMs
  gasCostPollEnabled: boolean = false
  syncIndex: number = 0
  syncFromDate: string
  customStartBlockNumber: number
  isRelayableChainEnabled: boolean = false
  ready: boolean = false
  // Experimental: Websocket support
  wsProvider: providers.WebSocketProvider
  wsCache: Record<string, any> = {}

  constructor (config: Config) {
    super({
      chainSlug: config.chainSlug,
      tokenSymbol: config.tokenSymbol,
      logColor: 'gray',
      bridgeContract: config.bridgeContract
    })
    this.syncFromDate = config.syncFromDate!
    if (typeof config.gasCostPollEnabled === 'boolean') {
      this.gasCostPollEnabled = config.gasCostPollEnabled
      this.logger.debug(`gasCostPollEnabled: ${this.gasCostPollEnabled}`)
    }

    // There is a multiplier for each chain and a multiplier for each network (passed in by config)
    const chainMultiplier = ChainPollMultiplier?.[this.chainSlug] ?? 1
    const networkMultiplier = SyncIntervalMultiplier
    this.syncIntervalMs = SyncIntervalSec * chainMultiplier * networkMultiplier * 1000
    this.logger.debug(`syncIntervalMs set to ${this.syncIntervalMs}. chainMultiplier: ${chainMultiplier}, networkMultiplier: ${networkMultiplier}`)

    if (this.syncIntervalMs > TenMinutesMs) {
      this.logger.error('syncIntervalMs must be less than 10 minutes. Please use a lower multiplier')
      this.quit()
    }

    const enabledNetworks = getEnabledNetworks()
    for (const enabledNetwork of enabledNetworks) {
      if (RelayableChains.includes(enabledNetwork)) {
        this.isRelayableChainEnabled = true
        break
      }
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
      this.logger.debug(`syncing from syncFromDate with timestamp ${timestamp}`)
      this.customStartBlockNumber = await getBlockNumberFromDate(this.chainSlug, timestamp)
      this.logger.debug(`syncing from syncFromDate with blockNumber ${this.customStartBlockNumber}`)
    }

    // TODO: This only works for Alchemy and Quiknode. Add WS url to config long term.
    if (wsEnabledChains.includes(this.chainSlug)) {
      const wsProviderUrl = getRpcUrl(this.chainSlug)!.replace('https://', 'wss://')
      const rpcProviderName: RootProviderName | undefined = await getRpcRootProviderName(wsProviderUrl)
      if (rpcProviderName && DoesRootProviderSupportWs[rpcProviderName]) {
        this.logger.debug(`using websocket provider for ${this.chainSlug} and rpcProviderName ${rpcProviderName}`)
        this.wsProvider = new providers.WebSocketProvider(wsProviderUrl)
        this.initEventWebsockets()
      }
    }

    this.ready = true
  }

  async #tilReady (): Promise<void> {
    while (true) {
      if (this.#isReady()) {
        this.logger.debug('SyncWatcher ready')
        return
      }
      await wait(5 * 1000)
    }
  }

  #isReady (): boolean {
    if (
      this.ready &&
      isDbSetReady(this.tokenSymbol)
    ) {
      return true
    }
    return false
  }

  async start () {
    await this.#tilReady()

    try {
      // The initial sync has to be performed in order so that transfers and transferRoots at the source can
      // be observed prior to their observation at the destination. After the initial sync, this does not
      // matter since chain finality will enforce this.
      this.logger.debug('starting initial sync')
      await this.handleInitialSync()
      this.logger.debug('initial sync complete')

      // Run polling sync
      await Promise.all([
        this.pollGasCost(),
        this.pollSync()
      ])
    } catch (err) {
      this.logger.error(`sync watcher error: ${err.message}\ntrace: ${err.stack}`)
      this.notifier.error(`sync watcher error: ${err.message}`)
      this.quit()
    }
  }

  async pollSync () {
    this.logger.debug('starting pollSync')
    while (true) {
      try {
        await this.preSyncHandler()
        await this.syncHandler()
        this.logger.debug(`done syncing pure handlers. index: ${this.syncIndex}`)
        await this.incompletePollSync()
        this.logger.debug(`done syncing incomplete items. index: ${this.syncIndex}`)
        await this.postSyncHandler()
      } catch (err) {
        this.notifier.error(`pollSync error: ${err.message}`)
        this.logger.error('pollSync error:', err)
      }
    }
  }

  async incompletePollSync () {
    try {
      await Promise.all([
        this.incompleteTransfersPollSync(),
        this.incompleteTransferRootsPollSync()
      ])
    } catch (err) {
      this.logger.error(`incomplete poll sync watcher error: ${err.message}\ntrace: ${err.stack}`)
    }
  }

  async incompleteTransferRootsPollSync () {
    try {
      const concurrency = 30
      const incompleteTransferRoots = await this.db.transferRoots.getIncompleteItems({
        sourceChainId: this.chainSlugToId(this.chainSlug)
      })
      this.logger.info(`transfer roots incomplete items: ${incompleteTransferRoots.length}`)
      if (!incompleteTransferRoots.length) {
        return
      }

      await promiseQueue(incompleteTransferRoots, async (transferRoot: TransferRoot, i: number) => {
        const { transferRootId } = transferRoot
        const logger = this.logger.create({ id: transferRootId })
        logger.debug(`populating transferRoot id: ${transferRootId}`)
        return this.populateTransferRootDbItem(transferRootId)
          .catch((err: Error) => {
            logger.error('populateTransferRootDbItem error:', err)
          })
      }, { concurrency })
    } catch (err: any) {
      this.logger.error(`incomplete transfer roots poll sync watcher error: ${err.message}\ntrace: ${err.stack}`)
    }
  }

  async incompleteTransfersPollSync () {
    // During an initial sync, old transactions might be labeled as notFound here. This is because
    // a chain that finishes event syncing quickly will start this poller prior to the other chain completing
    // the event syncing. When this happens, the DB might not have the counterpart transaction yet. For example,
    // if a bondWithdrawal is seen and gets here, the transferSent tx from the other chain might not yet
    // be in the DB and will be labeled as notFound. This is a rare case. One possible issue this leads to
    // is a transferRoot with all transfers notFound. In this case, the root will not be settled.
    try {
      const concurrency = 30
      const incompleteTransfers = await this.db.transfers.getIncompleteItems({
        sourceChainId: this.chainSlugToId(this.chainSlug)
      })
      this.logger.info(`transfers incomplete items: ${incompleteTransfers.length}`)
      if (!incompleteTransfers.length) {
        return
      }

      await promiseQueue(incompleteTransfers, async (transfer: Transfer, i: number) => {
        const { transferId } = transfer
        const logger = this.logger.create({ id: transferId })
        logger.debug(`populating transferId: ${transferId}`)
        return this.populateTransferDbItem(transferId)
          .catch((err: Error) => {
            logger.error('populateTransferDbItem error:', err)
          })
      }, { concurrency })
    } catch (err: any) {
      this.logger.error(`incomplete transfers poll sync watcher error: ${err.message}\ntrace: ${err.stack}`)
    }
  }

  async preSyncHandler () {
    this.logger.debug('syncing up events. index:', this.syncIndex)
  }

  async postSyncHandler () {
    this.logger.debug('done syncing. index:', this.syncIndex)
    this.syncIndex++
    try {
      await this.availableLiquidityWatcher.uploadToS3()
    } catch (err) {
      this.logger.error(err)
    }
    await wait(this.syncIntervalMs)
  }

  isSourceChainInitialSyncCompleted (): boolean {
    return this.sourceChainInitialSyncCompleted
  }

  isInitialSyncCompleted (): boolean {
    return this.initialSyncCompleted
  }

  isAllSiblingWatchersSourceChainInitialSyncCompleted (): boolean {
    return Object.values(this.siblingWatchers).every(
      (siblingWatcher: SyncWatcher) => {
        return siblingWatcher.isSourceChainInitialSyncCompleted()
      }
    )
  }

  isAllSiblingWatchersInitialSyncCompleted (): boolean {
    return Object.values(this.siblingWatchers).every(
      (siblingWatcher: SyncWatcher) => {
        return siblingWatcher.isInitialSyncCompleted()
      }
    )
  }

  async syncHandler (): Promise<void> {
    // Events that are related to user transfers can be polled every cycle while all other, less
    // time-sensitive events can be polled every N cycles.
    const shouldSyncAllEvents = this.syncIndex % SyncCyclesPerFullSync === 0
    if (shouldSyncAllEvents) {
      await Promise.all(this.getAllPromises())
    } else {
      await Promise.all(this.getTransferSentPromises())
    }
    await this.availableLiquidityWatcher.syncBonderCredit()
  }

  async handleInitialSync (): Promise<void> {
    // The initial sync has the potential to deal with a lot of data. To avoid OOM errors, handle
    // the data more slowly than the normal sync by running the items in the initial sync serially
    // instead of in parallel.

    // Sync items that do not rely on data from other items
    const asyncPromises: EventPromise = this.getAsyncPromises()
    const syncPromises: EventPromise = this.getSyncPromises()
    const initialSyncSourceChainPromises: EventPromise = [
      ...asyncPromises,
      ...syncPromises
    ]
    await Promise.all(initialSyncSourceChainPromises)

    // Sync incomplete items in order to get timestamps needed for ordered promises
    this.logger.debug('initialSyncSourceChainPromises complete. syncing incomplete items.')
    await this.incompletePollSync()

    // Wait for all transfers to sync their initialSyncSourceChainPromises
    this.logger.debug('source chain incompletePollSync completed. waiting for sibling watchers to complete initial sync')
    this.sourceChainInitialSyncCompleted = true
    while (true) {
      if (this.isAllSiblingWatchersSourceChainInitialSyncCompleted()) {
        this.logger.debug('all sibling watchers completed source chain initial sync')
        break
      }
      await wait(5000)
    }

    // Sync remaining events that require data from other events
    const orderedPromises: EventPromise = this.getOrderedPromises()
    await Promise.all(orderedPromises)

    this.initialSyncCompleted = true
    while (true) {
      if (this.isAllSiblingWatchersInitialSyncCompleted()) {
        this.logger.debug('all sibling watchers completed dest chain initial sync')
        break
      }
      await wait(5000)
    }

    this.logger.debug('Syncing bonder credit on initial sync')
    await this.availableLiquidityWatcher.syncBonderCredit()
  }

  getSyncOptions (keyName: string) {
    // Use a custom start block number on the initial sync if it is defined
    let startBlockNumber: number = this.bridge.bridgeDeployedBlockNumber
    if (!this.isInitialSyncCompleted() && this.customStartBlockNumber) {
      startBlockNumber = this.customStartBlockNumber
    }

    return {
      syncCacheKey: this.syncCacheKey(keyName),
      startBlockNumber
    }
  }

  async getTransferSentToL2EventPromise (): Promise<any> {
    if (!this.isL1) return []

    const l1Bridge = this.bridge as L1Bridge
    return l1Bridge.mapTransferSentToL2Events(
      async event => this.handleTransferSentToL2Event(event),
      this.getSyncOptions(l1Bridge.TransferSentToL2)
    )
  }

  async getTransferRootConfirmedEventPromise (): Promise<any> {
    if (!this.isL1) return []

    const l1Bridge = this.bridge as L1Bridge
    return l1Bridge.mapTransferRootConfirmedEvents(
      async event => this.handleTransferRootConfirmedEvent(event),
      this.getSyncOptions(l1Bridge.TransferRootConfirmed)
    )
  }

  async getTransferBondChallengedEventPromise (): Promise<any> {
    if (!this.isL1) return []

    const l1Bridge = this.bridge as L1Bridge
    return l1Bridge.mapTransferBondChallengedEvents(
      async event => this.handleTransferBondChallengedEvent(event),
      this.getSyncOptions(l1Bridge.TransferBondChallenged)
    )
  }

  async getTransferSentEventPromise (isCustomSync: boolean = false): Promise<any> {
    if (this.isL1) return []

    const l2Bridge = this.bridge as L2Bridge
    const customSyncKeySuffix = l2Bridge.getCustomSyncKeySuffix()
    let keyName = l2Bridge.TransferSent
    if (isCustomSync && customSyncKeySuffix) {
      keyName += customSyncKeySuffix
    }

    return l2Bridge.mapTransferSentEvents(
      async event => this.handleTransferSentEvent(event, isCustomSync),
      this.getSyncOptions(keyName)
    )
  }

  async getTransferRootSetEventPromise (): Promise<any> {
    return this.bridge.mapTransferRootSetEvents(
      async event => this.handleTransferRootSetEvent(event),
      this.getSyncOptions(this.bridge.TransferRootSet)
    )
  }

  async getTransferRootBondedEventPromise (): Promise<any> {
    if (!this.isL1) return []

    const l1Bridge = this.bridge as L1Bridge
    return l1Bridge.mapTransferRootBondedEvents(
      async event => this.handleTransferRootBondedEvent(event),
      this.getSyncOptions(l1Bridge.TransferRootBonded)
    )
  }

  async getTransfersCommittedEventPromise (): Promise<any> {
    if (this.isL1) return []

    const l2Bridge = this.bridge as L2Bridge
    return l2Bridge.mapTransfersCommittedEvents(
      async event => this.handleTransfersCommittedEvent(event),
      this.getSyncOptions(l2Bridge.TransfersCommitted)
    )
  }

  async getWithdrawalBondedEventPromise (): Promise<any> {
    return this.bridge.mapWithdrawalBondedEvents(
      async event => this.handleWithdrawalBondedEvent(event),
      this.getSyncOptions(this.bridge.WithdrawalBonded)
    )
  }

  async getWithdrewEventPromise (): Promise<any> {
    return this.bridge.mapWithdrewEvents(
      async event => this.handleWithdrewEvent(event),
      this.getSyncOptions(this.bridge.Withdrew)
    )
  }

  async getMultipleWithdrawalsSettledEventPromise (): Promise<any> {
    return this.bridge.mapMultipleWithdrawalsSettledEvents(
      async event => this.handleMultipleWithdrawalsSettledEvent(event),
      this.getSyncOptions(this.bridge.MultipleWithdrawalsSettled)
    )
  }

  async getWithdrawalBondSettledEventPromise (): Promise<any> {
    return this.bridge.mapWithdrawalBondSettledEvents(
      async event => this.handleWithdrawalBondSettledEvent(event),
      this.getSyncOptions(this.bridge.WithdrawalBondSettled)
    )
  }

  getAsyncPromises (): EventPromise {
    // Handlers that do not rely on data from other handlers
    return [
      this.getTransferSentToL2EventPromise(),
      this.getTransferRootConfirmedEventPromise(),
      this.getTransferBondChallengedEventPromise(),
      this.getTransferSentEventPromise(),
      this.getTransferRootSetEventPromise()
    ]
  }

  getSyncPromises (): EventPromise {
    // Handlers that are required at the source for handlers at the destination to work
    return [
      this.getTransferRootBondedEventPromise(),
      this.getTransfersCommittedEventPromise(),
      this.getWithdrawalBondedEventPromise(),
      this.getWithdrewEventPromise()
    ]
  }

  getOrderedPromises (): EventPromise {
    // These must be executed after the syncPromises event handlers at the source chain
    // since it relies on data from those handlers.
    return [
      this.getMultipleWithdrawalsSettledEventPromise(),
      this.getWithdrawalBondSettledEventPromise()
    ]
  }

  getAllPromises (): EventPromise {
    const asyncPromises: EventPromise = this.getAsyncPromises()
    const syncPromises: EventPromise = this.getSyncPromises()
    const orderedPromises: Promise<any> = Promise.all(syncPromises).then(async () => {
      await Promise.all(this.getOrderedPromises())
    })
    return [
      ...asyncPromises,
      orderedPromises
    ]
  }

  getTransferSentPromises (): EventPromise {
    // If a relayable chain is enabled, listen for TransferSentToL2 events on L1
    if (this.isL1 && this.isRelayableChainEnabled) {
      return [this.getTransferSentToL2EventPromise()]
    }

    // TransferSent events do not exist on L1
    if (this.isL1) return []

    let promises: EventPromise
    const isCustomSync = this.bridge.shouldPerformCustomSync()
    if (isCustomSync) {
      // Custom sync first, then sync finalized transfers
      // If syncs are not done in this order, there is a race condition upon bonder startup
      // where a transfer might be marked finalized and then subsequently unfinalized. Ordering
      // these ensures that does not happen.
      const syncPromises: EventPromise = [this.getTransferSentEventPromise(true)]
      promises = [Promise.all(syncPromises).then(async () => {
        await Promise.all([
          this.getTransferSentEventPromise()
        ])
      })]
    } else {
      promises = [this.getTransferSentEventPromise()]
    }

    return promises
  }

  async handleTransferSentToL2Event (event: TransferSentToL2Event) {
    const {
      chainId: destinationChainIdBn,
      recipient,
      amount,
      amountOutMin,
      deadline,
      relayer,
      relayerFee
    } = event.args
    const { transactionHash, logIndex } = event
    const destinationChainId: number = Number(destinationChainIdBn.toString())
    const transferId = getTransferSentToL2TransferId(
      destinationChainId,
      recipient,
      amount,
      amountOutMin,
      deadline,
      relayer,
      relayerFee,
      transactionHash,
      logIndex
    )
    const logger = this.logger.create({ id: transferId })

    try {
      const blockNumber: number = event.blockNumber
      const l1Bridge = this.bridge as L1Bridge
      const sourceChainId = await l1Bridge.getChainId()
      const isRelayable = this.getIsRelayable(relayerFee)

      logger.debug('handling TransferSentToL2 event', JSON.stringify({
        sourceChainId,
        destinationChainId,
        isRelayable,
        transferId,
        amount: this.bridge.formatUnits(amount),
        amountOutMin: this.bridge.formatUnits(amountOutMin),
        deadline: deadline.toString(),
        blockNumber,
        relayer,
        relayerFee: this.bridge.formatUnits(relayerFee),
        transactionHash,
        logIndex
      }))

      if (!isRelayable) {
        logger.warn('transfer is not relayable. fee:', relayerFee.toString())
      }

      await this.db.transfers.update(transferId, {
        transferId,
        destinationChainId,
        sourceChainId,
        recipient,
        amount,
        amountOutMin,
        deadline,
        relayer,
        relayerFee,
        isRelayable,
        transferSentTxHash: transactionHash,
        transferSentBlockNumber: blockNumber,
        transferSentLogIndex: logIndex
      })
    } catch (err) {
      logger.error(`handleTransferSentToL2Event error: ${err.message}`)
      this.notifier.error(`handleTransferSentToL2Event error: ${err.message}`)
    }
  }

  async handleTransferSentEvent (event: TransferSentEvent, isCustomSync: boolean) {
    const {
      transferId,
      chainId: destinationChainIdBn,
      recipient,
      amount,
      transferNonce,
      bonderFee,
      amountOutMin,
      deadline,
      index
    } = event.args
    const logger = this.logger.create({ id: transferId })

    try {
      const { transactionHash, logIndex } = event
      const transferSentIndex: number = index.toNumber()
      const blockNumber: number = event.blockNumber
      const l2Bridge = this.bridge as L2Bridge
      const destinationChainId = Number(destinationChainIdBn.toString())
      const sourceChainId = await l2Bridge.getChainId()
      const isBondable = this.getIsBondable(amountOutMin, deadline, destinationChainId, BigNumber.from(bonderFee))
      // isFinalized must be undefined if isCustomSync is not explicitly false
      // This handles the edge cases where the unfinalized syncer runs after the finalized syncer, which
      // should never happen unless RPC providers return out of order events
      const isFinalized = !isCustomSync ? true : undefined
      logger.debug('')

      logger.debug('handling TransferSent event', JSON.stringify({
        sourceChainId,
        destinationChainId,
        isBondable,
        transferId,
        amount: this.bridge.formatUnits(amount),
        bonderFee: this.bridge.formatUnits(bonderFee),
        amountOutMin: this.bridge.formatUnits(amountOutMin),
        deadline: deadline.toString(),
        transferSentIndex,
        logIndex,
        blockNumber,
        isFinalized
      }))

      if (!isBondable) {
        logger.warn('transfer is unbondable', amountOutMin, deadline)
      }

      const dbData: Transfer = {
        transferId,
        destinationChainId,
        sourceChainId,
        recipient,
        amount,
        transferNonce,
        bonderFee,
        amountOutMin,
        isBondable,
        deadline,
        transferSentTxHash: transactionHash,
        transferSentBlockNumber: blockNumber,
        transferSentIndex,
        transferSentLogIndex: logIndex,
        isFinalized
      }

      // When a transfer is finalized, reset its error states. It might have been marked
      // as notFound previously if there was weird behavior onchain after this
      // transfer was seen at the head. If this is the case, the transfer would not have been
      // bonded before finality and will need to be bonded now.
      if (isFinalized) {
        logger.debug(`finalized transfer seen, resetting unfinalized non-happy path states: isNotFound: ${dbData.isNotFound}, withdrawalBondTxErr: ${dbData.withdrawalBondTxError}, withdrawalBondBackoffIndex: ${dbData.withdrawalBondBackoffIndex}`)
        dbData.isNotFound = undefined
        dbData.withdrawalBondTxError = undefined
        dbData.withdrawalBondBackoffIndex = 0
      }

      await this.db.transfers.update(transferId, dbData)

      // Experimental: compare data against WS cache and clear the memory
      if (this.wsCache[transferId]) {
        this.compareWsCache(event)
        delete this.wsCache[event.args.transferId]
      }

      logger.debug('handleTransferSentEvent: stored transfer item')
    } catch (err) {
      logger.error(`handleTransferSentEvent error: ${err.message}`)
      this.notifier.error(`handleTransferSentEvent error: ${err.message}`)
    }
  }

  async handleWithdrawalBondedEvent (event: WithdrawalBondedEvent) {
    const { transactionHash } = event
    const { transferId, amount } = event.args
    const logger = this.logger.create({ id: transferId })

    logger.debug('handling WithdrawalBonded event', JSON.stringify({
      transferId,
      amount: this.bridge.formatUnits(amount)
    }))

    await this.db.transfers.update(transferId, {
      withdrawalBonded: true,
      withdrawalBondedTxHash: transactionHash,
      isTransferSpent: true,
      transferSpentTxHash: transactionHash
    })
  }

  async handleWithdrewEvent (event: WithdrewEvent) {
    const {
      transferId,
      recipient,
      amount,
      transferNonce
    } = event.args
    const logger = this.logger.create({ id: transferId })

    const { transactionHash } = event

    logger.debug('handling Withdrew event', JSON.stringify({
      transferId,
      transactionHash,
      recipient,
      amount,
      transferNonce
    }))

    await this.db.transfers.update(transferId, {
      isTransferSpent: true,
      transferSpentTxHash: transactionHash,
      isBondable: false
    })
  }

  async handleTransferRootConfirmedEvent (event: TransferRootConfirmedEvent) {
    const {
      rootHash: transferRootHash,
      totalAmount
    } = event.args
    const transferRootId = this.bridge.getTransferRootId(transferRootHash, totalAmount)
    const logger = this.logger.create({ root: transferRootId })
    logger.debug('handling TransferRootConfirmed event')

    try {
      const { transactionHash, blockNumber } = event
      await this.db.transferRoots.update(transferRootId, {
        transferRootHash,
        confirmed: true,
        confirmTxHash: transactionHash,
        confirmBlockNumber: blockNumber
      })
    } catch (err) {
      logger.error(`handleTransferRootConfirmedEvent error: ${err.message}`)
      this.notifier.error(
        `handleTransferRootConfirmedEvent error: ${err.message}`
      )
    }
  }

  async handleTransferRootBondedEvent (event: TransferRootBondedEvent) {
    const { transactionHash, blockNumber } = event
    const { root: transferRootHash, amount: totalAmount } = event.args
    const transferRootId = this.bridge.getTransferRootId(transferRootHash, totalAmount)

    const logger = this.logger.create({ root: transferRootId })

    try {
      logger.debug('handling TransferRootBonded event', JSON.stringify({
        transferRootHash,
        transactionHash,
        blockNumber,
        totalAmount: this.bridge.formatUnits(totalAmount),
        transferRootId: transferRootId
      }))

      await this.db.transferRoots.update(transferRootId, {
        transferRootHash,
        bonded: true,
        bondTxHash: transactionHash,
        bondBlockNumber: blockNumber,
        totalAmount
      })
    } catch (err) {
      logger.error(`handleTransferRootBondedEvent error: ${err.message}`)
      this.notifier.error(`handleTransferRootBondedEvent error: ${err.message}`)
    }
  }

  async handleTransfersCommittedEvent (event: TransfersCommittedEvent) {
    const {
      destinationChainId: destinationChainIdBn,
      rootHash: transferRootHash,
      totalAmount,
      rootCommittedAt: committedAtBn
    } = event.args
    const transferRootId = this.bridge.getTransferRootId(transferRootHash, totalAmount)
    const logger = this.logger.create({ root: transferRootId })

    try {
      const committedAt = Number(committedAtBn.toString())
      const { transactionHash, blockNumber, logIndex } = event
      const sourceChainId = await this.bridge.getChainId()
      const destinationChainId = Number(destinationChainIdBn.toString())

      const sourceChainSlug = this.chainIdToSlug(sourceChainId)
      const shouldBondTransferRoot = BondTransferRootChains.has(sourceChainSlug)

      logger.debug('handling TransfersCommitted event', JSON.stringify({
        transferRootId,
        committedAt,
        totalAmount: this.bridge.formatUnits(totalAmount),
        transferRootHash,
        destinationChainId,
        shouldBondTransferRoot,
        logIndex
      }))

      await this.db.transferRoots.update(transferRootId, {
        transferRootHash,
        totalAmount,
        committedAt,
        destinationChainId,
        sourceChainId,
        committed: true,
        commitTxHash: transactionHash,
        commitTxBlockNumber: blockNumber,
        commitTxLogIndex: logIndex,
        shouldBondTransferRoot
      })
    } catch (err) {
      logger.error(`handleTransfersCommittedEvent error: ${err.message}`)
      this.notifier.error(`handleTransfersCommittedEvent error: ${err.message}`)
    }
  }

  async handleTransferBondChallengedEvent (event: TransferBondChallengedEvent) {
    const {
      transferRootId,
      rootHash: transferRootHash,
      originalAmount
    } = event.args
    const logger = this.logger.create({ root: transferRootId })
    const { transactionHash } = event

    logger.debug('handling TransferBondChallenged event', JSON.stringify({
      transferRootId,
      transferRootHash,
      originalAmount: this.bridge.formatUnits(originalAmount),
      transactionHash
    }))

    await this.db.transferRoots.update(transferRootId, {
      transferRootHash,
      challenged: true
    })
  }

  async handleTransferRootSetEvent (event: TransferRootSetEvent) {
    const {
      rootHash: transferRootHash,
      totalAmount
    } = event.args
    const transferRootId = this.bridge.getTransferRootId(transferRootHash, totalAmount)
    const logger = this.logger.create({ root: transferRootId })
    const { transactionHash, blockNumber } = event

    logger.debug('handling TransferRootSet event', JSON.stringify({
      transferRootHash,
      totalAmount: this.bridge.formatUnits(totalAmount),
      transactionHash
    }))

    await this.db.transferRoots.update(transferRootId, {
      transferRootHash,
      rootSetTxHash: transactionHash,
      rootSetBlockNumber: blockNumber
    })
  }

  async populateTransferDbItem (transferId: string) {
    const dbTransfer = await this.db.transfers.getByTransferId(transferId)
    if (!dbTransfer) {
      throw new Error(`expected db transfer it, transferId: ${transferId}`)
    }

    const logger = this.logger.create({ id: transferId })

    if (!dbTransfer.sourceChainId) {
      logger.warn('populateTransferDbItem marking item not found. Missing sourceChainId (possibly due to missing TransferSent event). isNotFound: true')
      await this.db.transfers.update(transferId, { isNotFound: true })
      return
    }

    // Check if the source or destination has been deprecated
    const isSourceDeprecated = this.hasChainIdBeenDeprecated(dbTransfer.sourceChainId)
    let isDestinationDeprecated = false
    if (dbTransfer?.destinationChainId) {
      isDestinationDeprecated = this.hasChainIdBeenDeprecated(dbTransfer.destinationChainId)
    }
    if (isSourceDeprecated || isDestinationDeprecated) {
      logger.warn(`source ${dbTransfer.sourceChainId} deprecation status ${isSourceDeprecated}, dest${dbTransfer?.destinationChainId} deprecation status ${isDestinationDeprecated}. isNotFound: true`)
      await this.db.transfers.update(transferId, { isNotFound: true })
      return
    }

    await this.populateTransferSentTimestamp(transferId)
  }

  async populateTransferRootDbItem (transferRootId: string) {
    const dbTransferRoot = await this.db.transferRoots.getByTransferRootId(transferRootId)
    if (!dbTransferRoot) {
      throw new Error(`expected db transfer root item, transferRootId: ${transferRootId}`)
    }

    const logger = this.logger.create({ id: transferRootId })

    if (!dbTransferRoot.sourceChainId) {
      logger.warn('populateTransferRootDbItem marking item not found. Missing sourceChainId (possibly due to missing TransfersCommitted event). transfer isNotFound: true')
      await this.db.transferRoots.update(transferRootId, { isNotFound: true })
      return
    }

    // Check if the source or destination has been deprecated
    const isSourceDeprecated = this.hasChainIdBeenDeprecated(dbTransferRoot.sourceChainId)
    let isDestinationDeprecated = false
    if (dbTransferRoot?.destinationChainId) {
      isDestinationDeprecated = this.hasChainIdBeenDeprecated(dbTransferRoot.destinationChainId)
    }
    if (isSourceDeprecated || isDestinationDeprecated) {
      logger.warn(`source ${dbTransferRoot.sourceChainId} deprecation status ${isSourceDeprecated}, dest${dbTransferRoot?.destinationChainId} deprecation status ${isDestinationDeprecated}. transferRoot isNotFound: true`)
      await this.db.transferRoots.update(transferRootId, { isNotFound: true })
      return
    }

    await this.populateTransferRootCommittedAt(transferRootId)
    await this.populateTransferRootBondedAt(transferRootId)
    await this.populateTransferRootConfirmedAt(transferRootId)
    await this.populateTransferRootSetTimestamp(transferRootId)
    // Populating transferRootIds is not strictly associated with an event, so we handle it here
    await this.populateTransferRootTransferIds(transferRootId)
  }

  async populateTransferSentTimestamp (transferId: string) {
    const logger = this.logger.create({ id: transferId })
    logger.debug('starting populateTransferSentTimestamp')
    const dbTransfer = await this.db.transfers.getByTransferId(transferId)
    if (!dbTransfer) {
      logger.error('populateTransferSentTimestamp item not found')
      return
    }

    const {
      sourceChainId,
      transferSentTxHash,
      transferSentBlockNumber,
      transferSentTimestamp,
      recipient
    } = dbTransfer

    if (!sourceChainId || !transferSentTxHash || !transferSentBlockNumber) {
      logger.warn(`populateTransferSentTimestamp marking item not found: sourceChainId. dbItem: ${JSON.stringify(dbTransfer)}`)
      await this.db.transfers.update(transferId, { isNotFound: true })
      return
    }

    if (transferSentTimestamp) {
      logger.debug(`populateTransferSentTimestamp already found. dbItem: ${JSON.stringify(dbTransfer)}`)
      return
    }

    let sourceBridge
    try {
      sourceBridge = this.getSiblingWatcherByChainId(sourceChainId).bridge
    } catch {}
    if (!sourceBridge) {
      logger.warn(`populateTransferSentTimestamp sourceBridge not found. This could be due to the removal of a chain. marking item not found: sourceBridge. dbItem: ${JSON.stringify(dbTransfer)}`)
      await this.db.transfers.update(transferId, { isNotFound: true })
      return
    }

    const tx: providers.TransactionResponse = await sourceBridge.provider!.getTransaction(transferSentTxHash)
    if (!tx) {
      logger.warn(`populateTransferSentTimestamp marking item not found: tx ${transferSentTxHash} on sourceChainId ${sourceChainId}. dbItem: ${JSON.stringify(dbTransfer)}`)
      await this.db.transfers.update(transferId, { isNotFound: true })
      return
    }

    // A timestamp should exist in a mined transaction. If it does not, look it up
    let { from, timestamp } = tx
    if (!timestamp) {
      timestamp = await sourceBridge.getBlockTimestamp(transferSentBlockNumber)
    }

    logger.debug(`populateTransferSentTimestamp: sender: ${from}, timestamp: ${timestamp}`)
    await this.db.transfers.update(transferId, {
      transferSentTimestamp: timestamp
    })

    const isBlocklisted = this.getIsBlocklisted([from, recipient!])
    if (isBlocklisted) {
      const msg = `transfer is unbondable because sender or recipient is in blocklist. transferId: ${transferId}, sender: ${from}, recipient: ${recipient}`
      logger.warn(msg)
      this.notifier.warn(msg)
      await this.db.transfers.update(transferId, {
        isBondable: false
      })
    }
  }

  async populateTransferRootCommittedAt (transferRootId: string) {
    const logger = this.logger.create({ root: transferRootId })
    logger.debug('starting populateTransferRootCommittedAt')
    const dbTransferRoot = await this.db.transferRoots.getByTransferRootId(transferRootId)
    if (!dbTransferRoot) {
      logger.error('populateTransferRootCommittedAt item not found')
      return
    }

    const { sourceChainId, commitTxHash, committedAt } = dbTransferRoot

    if (
      !commitTxHash ||
      committedAt
    ) {
      logger.debug('populateTransferRootCommittedAt already found')
      return
    }

    if (!sourceChainId) {
      logger.warn(`populateTransferRootCommittedAt marking item not found: sourceChainId. dbItem: ${JSON.stringify(dbTransferRoot)}`)
      await this.db.transferRoots.update(transferRootId, { isNotFound: true })
      return
    }
    logger.debug('populating committedAt')
    let sourceBridge
    try {
      sourceBridge = this.getSiblingWatcherByChainId(sourceChainId).bridge
    } catch {}
    if (!sourceBridge) {
      logger.warn(`populateTransferRootCommittedAt sourceBridge not found. This could be due to the removal of a chain. marking item not found: sourceBridge. dbItem: ${JSON.stringify(dbTransferRoot)}`)
      await this.db.transferRoots.update(transferRootId, { isNotFound: true })
      return
    }

    const timestamp = await sourceBridge.getTransactionTimestamp(commitTxHash)
    if (!timestamp) {
      logger.warn(`populateTransferRootCommittedAt item not found. timestamp for commitTxHash: ${commitTxHash}. dbItem: ${JSON.stringify(dbTransferRoot)}`)
      await this.db.transferRoots.update(transferRootId, { isNotFound: true })
      return
    }
    logger.debug(`committedAt: ${timestamp}`)
    await this.db.transferRoots.update(transferRootId, {
      committedAt: timestamp
    })
  }

  async populateTransferRootBondedAt (transferRootId: string) {
    const logger = this.logger.create({ root: transferRootId })
    logger.debug('starting populateTransferRootBondedAt')
    const dbTransferRoot = await this.db.transferRoots.getByTransferRootId(transferRootId)
    if (!dbTransferRoot) {
      logger.error('populateTransferRootBondedAt item not found')
      return
    }

    const { bondTxHash, bondBlockNumber, bonder, bondedAt } = dbTransferRoot
    if (
      !bondTxHash ||
      (bonder && bondedAt)
    ) {
      logger.debug('populateTransferRootBondedAt already found')
      return
    }

    const destinationBridge = this.getSiblingWatcherByChainSlug(Chain.Ethereum).bridge
    const tx = await destinationBridge.getTransaction(bondTxHash)
    if (!tx) {
      logger.warn(`populateTransferRootBondedAt marking item not found: tx object for transactionHash: ${bondTxHash} on chain: ${Chain.Ethereum}. dbItem: ${JSON.stringify(dbTransferRoot)}`)
      await this.db.transferRoots.update(transferRootId, { isNotFound: true })
      return
    }

    const { from } = tx
    const timestamp = await destinationBridge.getBlockTimestamp(bondBlockNumber)

    if (!timestamp) {
      logger.warn(`populateTransferRootBondedAt marking item not found. timestamp for bondBlockNumber: ${bondBlockNumber}. dbItem: ${JSON.stringify(dbTransferRoot)}`)
      await this.db.transferRoots.update(transferRootId, { isNotFound: true })
      return
    }

    logger.debug(`bonder: ${from}`)
    logger.debug(`bondedAt: ${timestamp}`)

    await this.db.transferRoots.update(transferRootId, {
      bonder: from,
      bondedAt: timestamp
    })
  }

  async populateTransferRootConfirmedAt (transferRootId: string) {
    const logger = this.logger.create({ root: transferRootId })
    logger.debug('starting populateTransferRootConfirmedAt')
    const dbTransferRoot = await this.db.transferRoots.getByTransferRootId(transferRootId)
    if (!dbTransferRoot) {
      logger.error('populateTransferRootConfirmedAt item not found')
      return
    }

    const { confirmTxHash, confirmBlockNumber, confirmedAt } = dbTransferRoot
    if (
      !confirmTxHash ||
      confirmedAt
    ) {
      logger.debug('populateTransferRootConfirmedAt already found')
      return
    }

    const destinationBridge = this.getSiblingWatcherByChainSlug(Chain.Ethereum).bridge
    const tx = await destinationBridge.getTransaction(confirmTxHash)
    if (!tx) {
      logger.warn(`populateTransferRootConfirmedAt marking item not found: tx object for transactionHash: ${confirmTxHash} on chain: ${Chain.Ethereum}. dbItem: ${JSON.stringify(dbTransferRoot)}`)
      await this.db.transferRoots.update(transferRootId, { isNotFound: true })
      return
    }

    const timestamp = await destinationBridge.getBlockTimestamp(confirmBlockNumber)

    if (!timestamp) {
      logger.warn(`populateTransferRootConfirmedAt marking item not found. timestamp for confirmBlockNumber: ${confirmBlockNumber}. dbItem: ${JSON.stringify(dbTransferRoot)}`)
      await this.db.transferRoots.update(transferRootId, { isNotFound: true })
      return
    }

    logger.debug(`confirmedAt: ${timestamp}`)

    await this.db.transferRoots.update(transferRootId, {
      confirmedAt: timestamp
    })
  }

  async populateTransferRootSetTimestamp (transferRootId: string) {
    const logger = this.logger.create({ root: transferRootId })
    logger.debug('starting populateTransferRootSetTimestamp')
    const dbTransferRoot = await this.db.transferRoots.getByTransferRootId(transferRootId)
    if (!dbTransferRoot) {
      logger.error('populateTransferRootSetTimestamp item not found')
      return
    }

    const { rootSetBlockNumber, rootSetTimestamp, destinationChainId } = dbTransferRoot
    if (
      !rootSetBlockNumber || rootSetTimestamp
    ) {
      logger.debug('populateTransferRootSetTimestamp already found')
      return
    }
    if (!destinationChainId) {
      return
    }

    let destinationBridge
    try {
      destinationBridge = this.getSiblingWatcherByChainId(destinationChainId).bridge
    } catch {}
    if (!destinationBridge) {
      logger.warn(`populateTransferRootSetTimestamp destinationBridge not found. This could be due to the removal of a chain. marking item not found: sourceBridge. dbItem: ${JSON.stringify(dbTransferRoot)}`)
      await this.db.transferRoots.update(transferRootId, { isNotFound: true })
      return
    }
    const timestamp = await destinationBridge.getBlockTimestamp(rootSetBlockNumber)
    if (!timestamp) {
      logger.warn(`populateTransferRootSetTimestamp marking item not found. timestamp for rootSetBlockNumber: ${rootSetBlockNumber}. dbItem: ${JSON.stringify(dbTransferRoot)}`)
      await this.db.transferRoots.update(transferRootId, { isNotFound: true })
      return
    }
    logger.debug(`rootSetTimestamp: ${timestamp}`)
    await this.db.transferRoots.update(transferRootId, {
      rootSetTimestamp: timestamp
    })
  }

  async populateTransferRootTransferIds (transferRootId: string) {
    const logger = this.logger.create({ root: transferRootId })
    logger.debug('starting populateTransferRootTransferIds')
    const dbTransferRoot = await this.db.transferRoots.getByTransferRootId(transferRootId)
    if (!dbTransferRoot) {
      throw new Error('expected db transfer root item')
    }

    const {
      transferRootHash,
      sourceChainId,
      transferIds: dbTransferIds
    } = dbTransferRoot

    if (
      dbTransferIds !== undefined &&
      dbTransferIds.length > 0
    ) {
      logger.debug('populateTransferRootTransferIds transferIds already found')
      return
    }

    if (
      !transferRootHash ||
      (sourceChainId && isL1ChainId(sourceChainId))
    ) {
      logger.debug('populateTransferRootTransferIds not ready or not possible')
      return
    }

    const transferIds: string[] | undefined = await this.checkTransferIdsForRoot(dbTransferRoot)
    if (!transferIds) {
      logger.debug(`transfer ids not found for transferRootHash ${transferRootHash}. isNotFound: true`)
      await this.db.transferRoots.update(transferRootId, { isNotFound: true })
      return
    }

    logger.debug(`found transfer ids for transfer root hash ${transferRootHash}`, JSON.stringify(transferIds))
    const tree = new MerkleTree(transferIds)
    const computedTransferRootHash = tree.getHexRoot()
    if (computedTransferRootHash !== transferRootHash) {
      logger.warn(`computed root doesn't match. Expected ${transferRootHash}, got ${computedTransferRootHash}. IDs: ${JSON.stringify(transferIds)}`)
      await this.db.transferRoots.update(transferRootId, { isNotFound: true })
      return
    }

    await this.db.transferRoots.update(transferRootId, {
      transferIds
    })
  }

  async checkTransferIdsForRoot (dbTransferRoot: TransferRoot): Promise<string[] | undefined> {
    // transferIds can be retrieved a number of different ways depending on the state of the sync.
    // Try them in order of least resource consumption to most.

    const {
      transferRootId,
      transferRootHash,
      sourceChainId,
      destinationChainId,
      commitTxBlockNumber,
      commitTxLogIndex
    } = dbTransferRoot

    const logger = this.logger.create({ root: transferRootId })
    if (!transferRootHash) {
      logger.debug('populateTransferRootTransferIds not ready or not possible')
      return
    }

    let transferIds: string[] | undefined

    // Try finding transferIds with the tx calldata
    if (destinationChainId) {
      logger.debug(`looking at calldata for transfer ids for transferRootHash ${transferRootHash}`)
      transferIds = await this.checkTransferIdsForRootFromCalldata(transferRootId, destinationChainId)
    }

    // Try finding transferIds with the DB
    // NOTE: commitTxLogIndex can be 0, so we need to check for undefined
    if (
      !transferIds &&
      sourceChainId &&
      destinationChainId &&
      commitTxBlockNumber &&
      commitTxLogIndex !== undefined
    ) {
      logger.debug(`looking in db for transfer ids for transferRootHash ${transferRootHash}`)
      transferIds = await this.checkTransferIdsForRootFromDb(
        sourceChainId,
        destinationChainId,
        commitTxBlockNumber,
        commitTxLogIndex
      )
    }

    // Try finding transferIds with events
    if (
      !transferIds &&
      sourceChainId &&
      destinationChainId &&
      commitTxBlockNumber
    ) {
      logger.debug(`looking onchain for transfer ids for transferRootHash ${transferRootHash}`)
      transferIds = await this.checkTransferIdsForRootFromChain(
        transferRootId,
        transferRootHash,
        sourceChainId,
        destinationChainId,
        commitTxBlockNumber
      )
    }

    return transferIds
  }

  async checkTransferIdsForRootFromCalldata (
    transferRootId: string,
    destinationChainId: number
  ): Promise<string[] | undefined> {
    // This might not work if, for example, the tx executed by a contract or some other calldata
    let destinationBridge
    try {
      destinationBridge = this.getSiblingWatcherByChainId(destinationChainId).bridge
    } catch {}
    if (!destinationBridge) {
      return
    }

    const dbTransferRoot = await this.db.transferRoots.getByTransferRootId(transferRootId)
    if (!dbTransferRoot) {
      return
    }

    const { multipleWithdrawalsSettledTxHash } = dbTransferRoot
    if (!multipleWithdrawalsSettledTxHash) {
      return
    }
    try {
      const { transferIds } = await destinationBridge.getParamsFromMultipleSettleEventTransaction(multipleWithdrawalsSettledTxHash)
      return transferIds
    } catch (err) {}
  }

  async checkTransferIdsForRootFromDb (
    sourceChainId: number,
    destinationChainId: number,
    commitTxBlockNumber: number,
    commitTxLogIndex: number
  ): Promise<string[] | undefined> {
    return this.db.transfers.getTransfersIdsWithTransferRootHash({
      sourceChainId,
      destinationChainId,
      commitTxBlockNumber,
      commitTxLogIndex
    })
  }

  async lookupTransferIds (
    sourceBridge: L2Bridge,
    transferRootHash: string,
    destinationChainId: number,
    endBlockNumber: number
  ) {
    const logger = this.logger.create({ root: transferRootHash })
    let startEvent: TransfersCommittedEvent | undefined
    let endEvent: TransfersCommittedEvent | undefined
    let startBlockNumber = sourceBridge.bridgeDeployedBlockNumber

    logger.debug('startBlockNumber:', startBlockNumber)
    logger.debug('endBlockNumber:', endBlockNumber)

    await sourceBridge.eventsBatch(async (start: number, end: number) => {
      let events = await sourceBridge.getTransfersCommittedEvents(start, end)
      if (!events.length) {
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
    { endBlockNumber, startBlockNumber })

    if (!endEvent) {
      return { endEvent: null }
    }

    endBlockNumber = endEvent.blockNumber
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

          if (event.blockNumber === endEvent?.blockNumber) {
            // If TransferSent is in the same tx as TransfersCommitted or later,
            // the transferId should be included in the next transferRoot
            if (event.transactionIndex > endEvent.transactionIndex) {
              continue
            }
          }

          transfers.unshift({
            transferId: event.args.transferId,
            index: Number(event.args.index.toString()),
            blockNumber: event.blockNumber
          })
        }
      },
      { startBlockNumber, endBlockNumber }
    )

    const { sortedTransfers, missingIndexes } = getSortedTransferIds(transfers, startBlockNumber)

    if (missingIndexes?.length) {
      logger.warn(`missing indexes from list of transferIds (${missingIndexes.length}): ${JSON.stringify(missingIndexes)}`)
    }

    const transferIds = sortedTransfers.map((x: any) => x.transferId)
    return { startEvent, endEvent, transferIds }
  }

  async checkTransferIdsForRootFromChain (
    transferRootId: string,
    transferRootHash: string,
    sourceChainId: number,
    destinationChainId: number,
    commitTxBlockNumber: number
  ): Promise<string[] | undefined> {
    const logger = this.logger.create({ root: transferRootId })
    if (!this.hasSiblingWatcher(sourceChainId)) {
      logger.error(`no sibling watcher found for ${sourceChainId}`)
      return
    }

    let sourceBridge
    try {
      sourceBridge = this.getSiblingWatcherByChainId(sourceChainId)
        .bridge as L2Bridge
    } catch {}
    if (!sourceBridge) {
      return
    }

    const eventBlockNumber: number = commitTxBlockNumber

    /**
     * Onchain lookups may take a long time. However, this could block the bonder from other processes.
     * In the worst case, there could be a bug and this could be expensive as well. Most lookups will take
     * on the order of seconds. Some low-used routes may take longer as the lookup traverses back through
     * the chain looking for transfers. Set a time that is reasonable for most cases, but will not block the bonder.
     *
     * This also handles the case of the first root per route. When a new chain is added to an old bridge
     * the result is that the old bridge will look all the way back to when it is deployed before ignoring the root.
     * This blocks the bonder process for many hours and uses excessive RPC calls. This will block that from
     * happening without manually adding the first chain per route for each new bridge
     */
    let lookupTransferIdsRes
    const onchainLookupTimeoutSec = 60_000
    try {
      lookupTransferIdsRes = await promiseTimeout(this.lookupTransferIds(
        sourceBridge,
        transferRootHash,
        destinationChainId,
        eventBlockNumber
      ), onchainLookupTimeoutSec)
    } catch (err) {
      logger.error(`checkTransferIdsForRootFromChain onchain lookup timed out after ${onchainLookupTimeoutSec} seconds`)
      await this.db.transferRoots.update(transferRootId, { isNotFound: true })
      return
    }

    const { endEvent, transferIds } = lookupTransferIdsRes
    if (!transferIds) {
      throw new Error('expected transfer ids')
    }

    if (!endEvent) {
      logger.warn(`checkTransferRootFromChain no end event found for transferRootHash ${transferRootHash}. isNotFound: true`)
      await this.db.transferRoots.update(transferRootId, { isNotFound: true })
      return
    }

    return transferIds
  }

  async handleMultipleWithdrawalsSettledEvent (event: MultipleWithdrawalsSettledEvent) {
    const {
      bonder,
      rootHash: transferRootHash,
      totalBondsSettled
    } = event.args
    const { transactionHash } = event
    const transferRootId = await this.db.transferRoots.getTransferRootIdByTransferRootHash(transferRootHash)
    // Throwing here is not ideal, but it is required because we don't have the context of the transferId
    // with this event data. We can only get it from prior events. We should always see other events
    // first, but in the case where we completely miss an event, we will explicitly throw here.
    if (!transferRootId) {
      throw new Error(`expected db item for transfer root hash "${transferRootHash}"`)
    }

    const logger = this.logger.create({ root: transferRootId })
    logger.debug('handling MultipleWithdrawalsSettled event', JSON.stringify({
      transactionHash,
      transferRootHash,
      bonder,
      totalBondsSettled: this.bridge.formatUnits(totalBondsSettled)
    }))

    await this.db.transferRoots.update(transferRootId, {
      transferRootHash,
      multipleWithdrawalsSettledTxHash: transactionHash,
      settled: true
    })
  }

  handleWithdrawalBondSettledEvent = async (event: WithdrawalBondSettledEvent) => {
    const { transactionHash } = event
    const {
      bonder,
      transferId,
      rootHash: transferRootHash
    } = event.args
    const logger = this.logger.create({ id: transferId })
    logger.debug('handling WithdrawalBondSettled event', JSON.stringify({
      transactionHash,
      transferRootHash,
      bonder,
      transferId
    }))
    // Nothing is stored here. The current bonder assumptions make the bonder unconcerned with this.
  }

  getIsBondable = (
    amountOutMin: BigNumber,
    deadline: BigNumber,
    destinationChainId: number,
    bonderFee: BigNumber
  ): boolean => {
    const attemptSwapDuringBondWithdrawal = this.bridge.shouldAttemptSwapDuringBondWithdrawal(amountOutMin, deadline)
    if (attemptSwapDuringBondWithdrawal && isL1ChainId(destinationChainId)) {
      return false
    }

    const isTooLow = this.isBonderFeeTooLow(bonderFee)
    if (isTooLow) {
      return false
    }

    return true
  }

  getIsRelayable = (
    relayerFee: BigNumber
  ): boolean => {
    // TODO: Introduce after integration updates
    return true
    // return relayerFee.gt(0)
  }

  getIsBlocklisted (addresses: string[]) {
    for (const address of addresses) {
      const isBlocklisted = globalConfig?.blocklist?.addresses?.[address?.toLowerCase()]
      if (isBlocklisted) {
        return true
      }
    }
    return false
  }

  isBonderFeeTooLow (bonderFee: BigNumber) {
    if (bonderFee.eq(0)) {
      return true
    }

    if (this.tokenSymbol === 'ETH') {
      if (bonderFee.lt(minEthBonderFeeBn)) {
        return true
      }
    }

    return false
  }

  async pollGasCost () {
    if (!this.gasCostPollEnabled) {
      return
    }
    this.logger.debug(`starting pollGasCost, chainSlug: ${this.chainSlug}`)
    const bridgeContract = this.bridge.bridgeContract.connect(getRpcProvider(this.chainSlug)!) as L1BridgeContract | L2BridgeContract
    const amount = BigNumber.from(10)
    const amountOutMin = BigNumber.from(0)
    const bonderFee = BigNumber.from(1)
    const bonder = await this.bridge.getBonderAddress()
    const recipient = `0x${'1'.repeat(40)}`
    const transferNonce = `0x${'0'.repeat(64)}`

    while (true) {
      const logger = this.logger.create({ id: `${Date.now()}` })
      logger.debug('pollGasCost poll start')
      try {
        const gasPrice = await bridgeContract.provider.getGasPrice()
        const timestamp = Math.floor(Date.now() / 1000)
        const deadline = Math.floor((Date.now() + OneWeekMs) / 1000)
        const payload = [
          recipient,
          amount,
          transferNonce,
          bonderFee,
          {
            from: bonder
          }
        ] as const
        const gasLimit = await bridgeContract.estimateGas.bondWithdrawal(...payload)
        logger.debug('pollGasCost got estimateGas for bondWithdrawal')
        const tx = await bridgeContract.populateTransaction.bondWithdrawal(...payload)
        logger.debug('pollGasCost got populateTransaction for bondWithdrawal')
        const estimates = [{ gasLimit, ...tx, transactionType: GasCostTransactionType.BondWithdrawal }]

        if (!this.isL1) {
          const l2BridgeContract = bridgeContract as L2BridgeContract
          const payload = [
            recipient,
            amount,
            transferNonce,
            bonderFee,
            amountOutMin,
            deadline,
            {
              from: bonder
            }
          ] as const
          const gasLimit = await l2BridgeContract.estimateGas.bondWithdrawalAndDistribute(...payload)
          logger.debug('pollGasCost got estimateGas for bondWithdrawalAndDistribute')
          const tx = await l2BridgeContract.populateTransaction.bondWithdrawalAndDistribute(...payload)
          logger.debug('pollGasCost got populateTransaction for bondWithdrawalAndDistribute')
          estimates.push({ gasLimit, ...tx, transactionType: GasCostTransactionType.BondWithdrawalAndAttemptSwap })
        }

        if (RelayableChains.includes(this.chainSlug)) {
          let gasCost: BigNumber
          try {
            gasCost = await RelayerFee.getRelayCost(globalConfig.network, this.chainSlug, this.tokenSymbol)
          } catch (err) {
            logger.error(`pollGasCost error getting relayerFee: ${err.message}`)
            gasCost = BigNumber.from('0')
          }
          logger.debug('pollGasCost got relayGasCost')
          estimates.push({ gasLimit: gasCost, transactionType: GasCostTransactionType.Relay })
        }

        logger.debug('pollGasCost estimate. estimates complete')
        await Promise.all(estimates.map(async ({ gasLimit, data, to, transactionType }) => {
          let gasCostEstimation: GasCostEstimationRes
          try {
            const { gasCost, gasCostInToken, tokenPriceUsd, nativeTokenPriceUsd } = await this.bridge.getGasCostEstimation(
              this.chainSlug,
              this.tokenSymbol,
              gasPrice,
              gasLimit,
              transactionType,
              data,
              to
            )

            gasCostEstimation = {
              gasCost,
              gasCostInToken,
              gasLimit,
              tokenPriceUsd,
              nativeTokenPriceUsd
            }
          } catch (err) {
            logger.error(`pollGasCost error getting gasCostEstimation: ${err.message}`)
            throw err
          }

          const { gasCost, gasCostInToken, tokenPriceUsd, nativeTokenPriceUsd } = gasCostEstimation
          logger.debug(`pollGasCost got estimate for txPayload. transactionType: ${transactionType}, gasLimit: ${gasLimit?.toString()}, gasPrice: ${gasPrice?.toString()}, gasCost: ${gasCost?.toString()}, gasCostInToken: ${gasCostInToken?.toString()}, tokenPriceUsd: ${tokenPriceUsd?.toString()}`)
          const minBonderFeeAbsolute = await this.bridge.getMinBonderFeeAbsolute(this.tokenSymbol, tokenPriceUsd)
          logger.debug(`pollGasCost got estimate for minBonderFeeAbsolute. minBonderFeeAbsolute: ${minBonderFeeAbsolute.toString()}`)

          logger.debug('pollGasCost attempting to do db update')
          const gasCostData: GasCost = {
            chain: this.chainSlug,
            token: this.tokenSymbol,
            timestamp,
            transactionType,
            gasCost,
            gasCostInToken,
            gasPrice,
            gasLimit,
            tokenPriceUsd,
            nativeTokenPriceUsd,
            minBonderFeeAbsolute
          }
          // This method should not care about the key but would require GasCost DB architecture change
          // that is not worth it.
          const key: string = this.db.gasCost.getKeyFromValue(gasCostData)
          await this.db.gasCost.update(key, gasCostData)
          logger.debug('pollGasCost db update completed')
        }))
      } catch (err) {
        logger.error(`pollGasCost error: ${err.message}`)
      }
      logger.debug('pollGasCost poll end')
      await wait(this.gasCostPollMs)
    }
  }

  hasChainIdBeenDeprecated (chainId: number): boolean {
    // If a chainId has been deprecated, the chainId will not return a chain slug
    try {
      this.chainIdToSlug(chainId)
      return false
    } catch {
      return true
    }
  }

  // Experimental: Websocket support methods

  initWebsocket (contract: Contract, filter: EventFilter, cb: Function): void {
    contract.on(filter, async (...event: any) => cb(event[event.length - 1]))
    contract.on('error', async (...event: any) => this.handleWsError(event))
  }

  initEventWebsockets (): void {
    if (this.isL1) return

    const bridgeContract = this.bridge.bridgeContract.connect(this.wsProvider) as L2BridgeContract
    const filter = bridgeContract.filters.TransferSent()
    this.initWebsocket(
      bridgeContract,
      filter,
      async (event: TransferSentEvent) => this.handleWsSuccess(event)
    )
  }

  handleWsSuccess (event: TransferSentEvent): void {
    const args = event.args
    this.wsCache[args.transferId] = {
      chainId: args.chainId,
      recipient: args.recipient,
      amount: args.amount,
      transferNonce: args.transferNonce,
      bonderFee: args.bonderFee,
      amountOutMin: args.amountOutMin,
      deadline: args.deadline,
      index: args.index
    }
    this.logger.debug('handleWsSuccess: websocket event successfully logged', JSON.stringify(event))
  }

  handleWsError (event: any): void {
    this.logger.error('handleWsError: websocket error occurred', JSON.stringify(event))
  }

  compareWsCache (event: TransferSentEvent): void {
    const wsData = this.wsCache[event.args.transferId]
    if (JSON.stringify(wsData) === JSON.stringify(event.args)) {
      this.logger.error(`compareWsCache: websocket comparison to poller data failed for transferId ${event.args.transferId}. wsData: ${JSON.stringify(wsData)}, event: ${JSON.stringify(event)}`)
    } else {
      this.logger.debug(`compareWsCache: websocket comparison to poller data success for transferId ${event.args.transferId}`)
    }
  }
}

export default SyncWatcher
