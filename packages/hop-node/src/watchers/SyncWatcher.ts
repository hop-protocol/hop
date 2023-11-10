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
  GasCostTransactionType,
  OneWeekMs,
  RelayableChains,
  RootProviderName,
  TenMinutesMs
} from 'src/constants'
import { DateTime } from 'luxon'
import { FirstRoots } from 'src/constants/firstRootsPerRoute'
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
  SyncCyclesPerFullSync,
  SyncIntervalMultiplier,
  SyncIntervalSec,
  getEnabledNetworks,
  getProxyAddressForChain,
  config as globalConfig,
  isProxyAddressForChain,
  minEthBonderFeeBn,
  oruChains,
  wsEnabledChains
} from 'src/config'
import { Transfer } from 'src/db/TransfersDb'
import { TransferRoot } from 'src/db/TransferRootsDb'
import { getSortedTransferIds } from 'src/utils/getSortedTransferIds'
import { promiseQueue } from 'src/utils/promiseQueue'

type Config = {
  chainSlug: string
  tokenSymbol: string
  bridgeContract: L1BridgeContract | L2BridgeContract
  syncFromDate?: string
  gasCostPollEnabled?: boolean
}

type EventPromise = Array<Promise<any>>

class SyncWatcher extends BaseWatcher {
  initialSyncCompleted: boolean = false
  syncIntervalMs: number
  gasCostPollMs: number = 60 * 1000
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

  async start () {
    this.started = true
    try {
      await Promise.all([
        this.pollGasCost()
        // this.pollSync()
      ])
    } catch (err) {
      this.logger.error(`sync watcher error: ${err.message}\ntrace: ${err.stack}`)
      this.notifier.error(`sync watcher error: ${err.message}`)
      this.quit()
    }
  }

  async pollSync () {
    while (true) {
      try {
        if (!this.ready) {
          await wait(5 * 1000)
          continue
        }
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
      // Needs to be run synchronously because the transfers need to have the
      // withdrawalBonder entry completed
      await this.incompleteTransfersPollSync()
        .then(async () => await this.incompleteTransferRootsPollSync())
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
      if (incompleteTransferRoots.length) {
        await promiseQueue(incompleteTransferRoots, async (transferRoot: TransferRoot, i: number) => {
          const { transferRootId } = transferRoot
          const logger = this.logger.create({ id: transferRootId })
          logger.debug(`populating transferRoot id: ${transferRootId}`)
          return this.populateTransferRootDbItem(transferRootId)
            .catch((err: Error) => {
              logger.error('populateTransferRootDbItem error:', err)
              this.notifier.error(`populateTransferRootDbItem error: ${err.message}`)
            })
        }, { concurrency })
      }
    } catch (err: any) {
      this.logger.error(`incomplete transfer roots poll sync watcher error: ${err.message}\ntrace: ${err.stack}`)
      this.notifier.error(`incomplete transfer roots poll sync watcher error: ${err.message}`)
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
      if (incompleteTransfers.length) {
        await promiseQueue(incompleteTransfers, async (transfer: Transfer, i: number) => {
          const { transferId } = transfer
          const logger = this.logger.create({ id: transferId })
          logger.debug(`populating transferId: ${transferId}`)
          return this.populateTransferDbItem(transferId)
            .catch((err: Error) => {
              logger.error('populateTransferDbItem error:', err)
              this.notifier.error(`populateTransferDbItem error: ${err.message}`)
            })
        }, { concurrency })
      }
    } catch (err: any) {
      this.logger.error(`incomplete transfers poll sync watcher error: ${err.message}\ntrace: ${err.stack}`)
      this.notifier.error(`incomplete transfer poll sync watcher error: ${err.message}`)
    }
  }

  async preSyncHandler () {
    this.logger.debug('syncing up events. index:', this.syncIndex)
  }

  async postSyncHandler () {
    if (this.syncIndex === 0) {
      this.initialSyncCompleted = true
      this.logger.debug('initial sync complete')
    }
    this.logger.debug('done syncing. index:', this.syncIndex)
    this.syncIndex++
    try {
      await this.availableLiquidityWatcher.uploadToS3()
    } catch (err) {
      this.logger.error(err)
    }
    await wait(this.syncIntervalMs)
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
    // Events that are related to user transfers can be polled every cycle while all other, less
    // time-sensitive events can be polled every N cycles.
    let promisesPerPoll: EventPromise = []
    if (this.shouldSyncAllEvents()) {
      promisesPerPoll = this.getAllPromises()
    } else {
      promisesPerPoll = this.getTransferSentPromises()
    }

    // these must come after db is done syncing, and syncAvailableCredit must be last
    await Promise.all(promisesPerPoll)
      .then(async () => await this.availableLiquidityWatcher.syncBonderCredit())
  }

  shouldSyncAllEvents (): boolean {
    return !this.isInitialSyncCompleted() || this.isAtNewFullSyncCycleIndex()
  }

  isAtNewFullSyncCycleIndex (): boolean {
    return this.syncIndex % SyncCyclesPerFullSync === 0
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

  getAllPromises (): EventPromise {
    const asyncPromises: EventPromise = [
      this.getTransferSentToL2EventPromise(),
      this.getTransferRootConfirmedEventPromise(),
      this.getTransferBondChallengedEventPromise(),
      this.getTransferSentEventPromise(),
      this.getTransferRootSetEventPromise()
    ]
    const syncPromises: EventPromise = [
      this.getTransferRootBondedEventPromise(),
      this.getTransfersCommittedEventPromise(),
      this.getWithdrawalBondedEventPromise(),
      this.getWithdrewEventPromise()
    ]
    const orderedPromises: Promise<any> = Promise.all(syncPromises).then(async () => {
      // These must be executed after the Withdrew and WithdrawalBonded event handlers
      // on initial sync since it relies on data from those handlers
      await Promise.all([
        this.getMultipleWithdrawalsSettledEventPromise(),
        this.getWithdrawalBondSettledEventPromise()
      ])
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
    logger.debug('handling TransferSentToL2 event')

    try {
      const blockNumber: number = event.blockNumber
      const l1Bridge = this.bridge as L1Bridge
      const sourceChainId = await l1Bridge.getChainId()
      const isRelayable = this.getIsRelayable(relayerFee)

      logger.debug('sourceChainId:', sourceChainId)
      logger.debug('destinationChainId:', destinationChainId)
      logger.debug('isRelayable:', isRelayable)
      logger.debug('transferId:', transferId)
      logger.debug('amount:', this.bridge.formatUnits(amount))
      logger.debug('amountOutMin:', this.bridge.formatUnits(amountOutMin))
      logger.debug('deadline:', deadline.toString())
      logger.debug('transferSentBlockNumber:', blockNumber)
      logger.debug('relayer:', relayer)
      logger.debug('relayerFee:', this.bridge.formatUnits(relayerFee))
      logger.debug('transactionHash:', transactionHash)
      logger.debug('logIndex:', logIndex)

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

      logger.debug('handleTransferSentToL2Event: stored transfer item')
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
    logger.debug('handling TransferSent event')

    try {
      const { transactionHash } = event
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

      logger.debug('sourceChainId:', sourceChainId)
      logger.debug('destinationChainId:', destinationChainId)
      logger.debug('isBondable:', isBondable)
      logger.debug('transferId:', transferId)
      logger.debug('amount:', this.bridge.formatUnits(amount))
      logger.debug('bonderFee:', this.bridge.formatUnits(bonderFee))
      logger.debug('amountOutMin:', this.bridge.formatUnits(amountOutMin))
      logger.debug('deadline:', deadline.toString())
      logger.debug('transferSentIndex:', transferSentIndex)
      logger.debug('transferSentBlockNumber:', blockNumber)
      logger.debug('isFinalized:', isFinalized)

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

    logger.debug('handling WithdrawalBonded event')
    logger.debug('transferId:', transferId)
    logger.debug('amount:', this.bridge.formatUnits(amount))

    await this.db.transfers.update(transferId, {
      withdrawalBonded: true,
      withdrawalBondedTxHash: transactionHash,
      isTransferSpent: true,
      transferSpentTxHash: transactionHash,
      withdrawalBondSettled: false
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

    logger.debug('handling Withdrew event')
    logger.debug('transferId:', transferId)
    logger.debug('transactionHash:', transactionHash)
    logger.debug('recipient:', recipient)
    logger.debug('amount:', amount)
    logger.debug('transferNonce:', transferNonce)

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
    logger.debug('handling TransferRootBonded event')

    try {
      logger.debug(`transferRootHash from event: ${transferRootHash}`)
      logger.debug(`event transactionHash: ${transactionHash}`)
      logger.debug(`event blockNumber: ${blockNumber}`)
      logger.debug(`bondAmount: ${this.bridge.formatUnits(totalAmount)}`)
      logger.debug(`transferRootId: ${transferRootId}`)

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
    logger.debug('handling TransfersCommitted event')

    try {
      const committedAt = Number(committedAtBn.toString())
      const { transactionHash, blockNumber } = event
      const sourceChainId = await this.bridge.getChainId()
      const destinationChainId = Number(destinationChainIdBn.toString())

      const sourceChainSlug = this.chainIdToSlug(sourceChainId)
      const shouldBondTransferRoot = oruChains.has(sourceChainSlug)

      logger.debug('transferRootId:', transferRootId)
      logger.debug('committedAt:', committedAt)
      logger.debug('totalAmount:', this.bridge.formatUnits(totalAmount))
      logger.debug('transferRootHash:', transferRootHash)
      logger.debug('destinationChainId:', destinationChainId)
      logger.debug('shouldBondTransferRoot:', shouldBondTransferRoot)

      await this.db.transferRoots.update(transferRootId, {
        transferRootHash,
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

  async handleTransferBondChallengedEvent (event: TransferBondChallengedEvent) {
    const {
      transferRootId,
      rootHash: transferRootHash,
      originalAmount
    } = event.args
    const logger = this.logger.create({ root: transferRootId })
    const { transactionHash } = event

    logger.debug('handling TransferBondChallenged event')
    logger.debug(`transferRootId: ${transferRootId}`)
    logger.debug(`transferRootHash: ${transferRootHash}`)
    logger.debug(`originalAmount: ${this.bridge.formatUnits(originalAmount)}`)
    logger.debug(`event transactionHash: ${transactionHash}`)

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

    logger.debug('handling TransferRootSet event')
    logger.debug(`transferRootHash from event: ${transferRootHash}`)
    logger.debug(`bondAmount: ${this.bridge.formatUnits(totalAmount)}`)
    logger.debug(`event transactionHash: ${transactionHash}`)

    await this.db.transferRoots.update(transferRootId, {
      transferRootHash,
      rootSetTxHash: transactionHash,
      rootSetBlockNumber: blockNumber
    })
  }

  async checkTransferRootSettledState (transferRootId: string, totalBondsSettled: BigNumber, bonder: string) {
    const dbTransferRoot = await this.db.transferRoots.getByTransferRootId(transferRootId)
    if (!dbTransferRoot) {
      throw new Error('expected db transfer root item')
    }

    const logger = this.logger.create({ root: transferRootId })
    const { transferIds } = dbTransferRoot
    if (transferIds === undefined || !transferIds.length) {
      return
    }

    logger.debug('checkTransferRootSettledState')
    logger.debug(`transferRootId: ${transferRootId}`)
    logger.debug(`totalBondsSettled: ${this.bridge.formatUnits(totalBondsSettled)}`)
    logger.debug(`bonder : ${bonder}`)

    logger.debug(`transferIds count: ${transferIds.length}`)
    const dbTransfers: Transfer[] = []
    await Promise.all(transferIds.map(async transferId => {
      const dbTransfer = await this.db.transfers.getByTransferId(transferId)
      if (!dbTransfer) {
        logger.warn(`transfer id ${transferId} db item not found`)
        return
      }
      dbTransfers.push(dbTransfer)
      if (dbTransfer?.withdrawalBondSettled) {
        return
      }

      const isBonded = dbTransfer?.withdrawalBonded ?? false
      const isSameBonder = dbTransfer?.withdrawalBonder === bonder
      const isWithdrawalSettled = isBonded && isSameBonder
      await this.db.transfers.update(transferId, {
        withdrawalBondSettled: isWithdrawalSettled
      })
    }))

    logger.debug('transferIds checking allSettled')
    let rootAmountAllSettled = false
    if (totalBondsSettled) {
      rootAmountAllSettled = dbTransferRoot?.totalAmount?.eq(totalBondsSettled) ?? false
    }
    const allBondableTransfersSettled = this.getIsDbTransfersAllSettled(dbTransfers)
    const allSettled = rootAmountAllSettled || allBondableTransfersSettled
    logger.debug(`all settled: ${allSettled}`)
    await this.db.transferRoots.update(transferRootId, {
      allSettled
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

    await this.populateTransferSentTimestampAndSender(transferId)
    await this.populateTransferWithdrawalBonder(transferId)
    await this.populateTransferWithdrawalBondSettled(transferId)
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
    await this.populateTransferRootTimestamp(transferRootId)
    await this.populateTransferRootMultipleWithdrawSettled(transferRootId)
    await this.populateTransferRootTransferIds(transferRootId)
  }

  async populateTransferSentTimestampAndSender (transferId: string) {
    const logger = this.logger.create({ id: transferId })
    logger.debug('starting populateTransferSentTimestampAndSender')
    const dbTransfer = await this.db.transfers.getByTransferId(transferId)
    const {
      sourceChainId,
      transferSentTxHash,
      transferSentBlockNumber,
      transferSentTimestamp,
      sender,
      recipient
    } = dbTransfer

    if (!sourceChainId || !transferSentTxHash || !transferSentBlockNumber) {
      logger.warn(`populateTransferSentTimestampAndSender marking item not found: sourceChainId. dbItem: ${JSON.stringify(dbTransfer)}`)
      await this.db.transfers.update(transferId, { isNotFound: true })
      return
    }

    if (transferSentTimestamp && sender) {
      logger.debug(`populateTransferSentTimestampAndSender already found. dbItem: ${JSON.stringify(dbTransfer)}`)
      return
    }

    const sourceBridge = this.getSiblingWatcherByChainId(sourceChainId).bridge
    const tx: providers.TransactionResponse = await sourceBridge.provider!.getTransaction(transferSentTxHash)
    if (!tx) {
      logger.warn(`populateTransferSentTimestampAndSender marking item not found: tx ${transferSentTxHash} on sourceChainId ${sourceChainId}. dbItem: ${JSON.stringify(dbTransfer)}`)
      await this.db.transfers.update(transferId, { isNotFound: true })
      return
    }

    // A timestamp should exist in a mined transaction. If it does not, look it up
    let { from, timestamp } = tx
    if (!timestamp) {
      timestamp = await sourceBridge.getBlockTimestamp(transferSentBlockNumber)
    }

    logger.debug(`populateTransferSentTimestampAndSender: sender: ${from}, timestamp: ${timestamp}`)
    await this.db.transfers.update(transferId, {
      sender: from,
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

  async populateTransferWithdrawalBonder (transferId: string) {
    const logger = this.logger.create({ id: transferId })
    logger.debug('starting populateTransferWithdrawalBonder')
    const dbTransfer = await this.db.transfers.getByTransferId(transferId)
    const { destinationChainId, withdrawalBondedTxHash, withdrawalBonder } = dbTransfer
    if (
      !destinationChainId ||
      !withdrawalBondedTxHash ||
      withdrawalBonder
    ) {
      logger.debug('populateTransferWithdrawalBonder already found')
      return
    }
    const destinationBridge = this.getSiblingWatcherByChainId(destinationChainId).bridge
    const tx = await destinationBridge.getTransaction(withdrawalBondedTxHash)
    if (!tx) {
      logger.warn(`populateTransferWithdrawalBonder marking item not found: tx object with withdrawalBondedTxHash ${withdrawalBondedTxHash}. dbItem: ${JSON.stringify(dbTransfer)}`)
      await this.db.transfers.update(transferId, { isNotFound: true })
      return
    }

    let bonder = tx.from
    const destinationChainSlug = this.chainIdToSlug(destinationChainId)
    if (isProxyAddressForChain(this.tokenSymbol, destinationChainSlug)) {
      const proxyAddress = getProxyAddressForChain(this.tokenSymbol, destinationChainSlug)
      if (tx.to === proxyAddress) {
        bonder = tx.to
      }
    }
    logger.debug(`withdrawalBonder: ${bonder}`)
    await this.db.transfers.update(transferId, {
      withdrawalBonder: bonder
    })
  }

  async populateTransferWithdrawalBondSettled (transferId: string) {
    const logger = this.logger.create({ id: transferId })
    logger.debug('starting populateTransferWithdrawalBondSettled')
    const dbTransfer = await this.db.transfers.getByTransferId(transferId)
    if (!dbTransfer) {
      return
    }

    const { destinationChainId, withdrawalBondSettledTxHash } = dbTransfer
    if (dbTransfer.withdrawalBondSettled) {
      logger.debug('populateTransferWithdrawalBondSettled dbTransfer withdrawalBondSettled is true. Returning.')
      return
    }
    if (!(dbTransfer.withdrawalBondSettledTxHash && destinationChainId)) {
      logger.debug('populateTransferWithdrawalBondSettled dbTransfer withdrawalBondSettledTxHash or destinationChainId not found. Returning.')
      return
    }

    const destinationBridge = this.getSiblingWatcherByChainId(destinationChainId).bridge

    // TODO: Clean this up. getParamsFromMultipleSettleEventTransaction should be an event since it can be called in batch
    const tx = await destinationBridge.getTransactionReceipt(withdrawalBondSettledTxHash)
    let params
    try {
      const { rootHash, transferRootTotalAmount, bonder } = await destinationBridge.getParamsFromMultipleSettleEventTransaction(withdrawalBondSettledTxHash)
      params = {
        rootHash,
        bonder,
        totalAmount: transferRootTotalAmount
      }
    } catch (err) {
      const events = await destinationBridge.getWithdrawalBondSettledEvents(tx.blockNumber, tx.blockNumber)
      if (!events?.length) {
        logger.debug('populateTransferWithdrawalBondSettled event not found. Returning.')
        return
      }

      for (const event of events) {
        if (event?.topics?.[2] === transferId) {
          params = {
            rootHash: event?.args?.rootHash,
            bonder: event?.args?.bonder
          }
          break
        }
      }

      if (!params?.rootHash || !params?.bonder) {
        logger.debug('populateTransferWithdrawalBondSettled params not found. Returning.')
        return
      }
    }

    const { bonder } = params
    const isBonded = dbTransfer?.withdrawalBonded ?? false
    const isSameBonder = dbTransfer?.withdrawalBonder === bonder
    const isWithdrawalSettled = isBonded && isSameBonder
    if (!isWithdrawalSettled) {
      logger.debug('populateTransferWithdrawalBondSettled isWithdrawalSettled is true. Returning.')
      return
    }

    const bondedWithdrawalAmount = await this.bridge.getBondedWithdrawalAmountByBonder(bonder, transferId)

    // on-chain bonded withdrawal amount is cleared after WithdrawalBondSettled event
    if (!bondedWithdrawalAmount.eq(0)) {
      logger.debug('populateTransferWithdrawalBondSettled bondedWithdrawalAmount is not 0. Returning.')
      return
    }

    await this.db.transfers.update(transferId, {
      withdrawalBondSettled: true
    })

    // If a withdrawal is bonded solo, we don't know the root id. allSettled will be marked later.
    if (!params?.rootHash || !params?.totalAmount) {
      logger.debug('populateTransferWithdrawalBondSettled transferRootId params not found. Returning.')
      return
    }

    const transferRootId = this.bridge.getTransferRootId(params.rootHash, params.totalAmount)
    const dbTransferRoot = await this.db.transferRoots.getByTransferRootId(transferRootId)
    if (!dbTransferRoot) {
      logger.debug('populateTransferWithdrawalBondSettled dbTransferRoot not found. Returning.')
      return
    }

    const { transferIds } = dbTransferRoot
    if (!transferIds?.length) {
      logger.debug('populateTransferWithdrawalBondSettled dbTransferRoot transferIds not found. Returning.')
      return
    }

    logger.debug(`populateTransferWithdrawalBondSettled transferIds count: ${transferIds.length}`)
    const dbTransfers = await this.db.transfers.getMultipleTransfersByTransferIds(transferIds)
    if (!dbTransfers?.length) {
      logger.debug('db transfers not found. Returning.')
      return
    }

    const allSettled = this.getIsDbTransfersAllSettled(dbTransfers)
    logger.debug(`populateTransferWithdrawalBondSettled all settled: ${allSettled}`)
    if (!allSettled) {
      logger.debug('not all settled yet')
      return
    }

    await this.db.transferRoots.update(transferRootId, {
      allSettled
    })
  }

  async populateTransferRootCommittedAt (transferRootId: string) {
    const logger = this.logger.create({ root: transferRootId })
    logger.debug('starting populateTransferRootCommittedAt')
    const dbTransferRoot = await this.db.transferRoots.getByTransferRootId(transferRootId)
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
    const sourceBridge = this.getSiblingWatcherByChainId(sourceChainId).bridge
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

    let calculatedBonder: string = tx.from
    if (isProxyAddressForChain(this.tokenSymbol, Chain.Ethereum)) {
      const proxyAddress = getProxyAddressForChain(this.tokenSymbol, Chain.Ethereum)
      if (tx.to === proxyAddress) {
        calculatedBonder = tx.to
      }
    }
    const timestamp = await destinationBridge.getBlockTimestamp(bondBlockNumber)

    if (!timestamp) {
      logger.warn(`populateTransferRootBondedAt marking item not found. timestamp for bondBlockNumber: ${bondBlockNumber}. dbItem: ${JSON.stringify(dbTransferRoot)}`)
      await this.db.transferRoots.update(transferRootId, { isNotFound: true })
      return
    }

    logger.debug(`bonder: ${calculatedBonder}`)
    logger.debug(`bondedAt: ${timestamp}`)

    await this.db.transferRoots.update(transferRootId, {
      bonder: calculatedBonder,
      bondedAt: timestamp
    })
  }

  async populateTransferRootConfirmedAt (transferRootId: string) {
    const logger = this.logger.create({ root: transferRootId })
    logger.debug('starting populateTransferRootConfirmedAt')
    const dbTransferRoot = await this.db.transferRoots.getByTransferRootId(transferRootId)
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

  async populateTransferRootTimestamp (transferRootId: string) {
    const logger = this.logger.create({ root: transferRootId })
    logger.debug('starting populateTransferRootTimestamp')
    const dbTransferRoot = await this.db.transferRoots.getByTransferRootId(transferRootId)
    const { rootSetBlockNumber, rootSetTimestamp, destinationChainId } = dbTransferRoot
    if (
      !rootSetBlockNumber || rootSetTimestamp
    ) {
      logger.debug('populateTransferRootTimestamp already found')
      return
    }
    if (!destinationChainId) {
      return
    }
    const destinationBridge = this.getSiblingWatcherByChainId(destinationChainId).bridge
    const timestamp = await destinationBridge.getBlockTimestamp(rootSetBlockNumber)
    if (!timestamp) {
      logger.warn(`populateTransferRootTimestamp marking item not found. timestamp for rootSetBlockNumber: ${rootSetBlockNumber}. dbItem: ${JSON.stringify(dbTransferRoot)}`)
      await this.db.transferRoots.update(transferRootId, { isNotFound: true })
      return
    }
    logger.debug(`rootSetTimestamp: ${timestamp}`)
    await this.db.transferRoots.update(transferRootId, {
      rootSetTimestamp: timestamp
    })
  }

  async populateTransferRootMultipleWithdrawSettled (transferRootId: string) {
    const logger = this.logger.create({ root: transferRootId })
    logger.debug('starting transferRootMultipleWithdrawSettled')
    const dbTransferRoot = await this.db.transferRoots.getByTransferRootId(transferRootId)
    const { transferRootHash, transferIds, destinationChainId } = dbTransferRoot
    const multipleWithdrawalsSettledTotalAmount = await this.db.transferRoots.getMultipleWithdrawalsSettledTotalAmount(transferRootId)
    const multipleWithdrawalsSettledTxHash = await this.db.transferRoots.getMultipleWithdrawalsSettledTxHash(transferRootId)
    if (
      !multipleWithdrawalsSettledTxHash ||
      !multipleWithdrawalsSettledTotalAmount ||
      transferIds
    ) {
      logger.debug('populateTransferRootMultipleWithdrawSettled already found')
      return
    }

    if (!destinationChainId) {
      return
    }
    const destinationBridge = this.getSiblingWatcherByChainId(destinationChainId).bridge
    const { transferIds: _transferIds, bonder } = await destinationBridge.getParamsFromMultipleSettleEventTransaction(multipleWithdrawalsSettledTxHash)
    const tree = new MerkleTree(_transferIds)
    const computedTransferRootHash = tree.getHexRoot()
    if (computedTransferRootHash !== transferRootHash) {
      logger.warn(
        `populateTransferRootTimestamp computed transfer root hash doesn't match. Expected ${transferRootHash}, got ${computedTransferRootHash}. isNotFound: true, List: ${JSON.stringify(_transferIds)}`
      )
      await this.db.transferRoots.update(transferRootId, { isNotFound: true })
    }

    await this.db.transferRoots.update(transferRootId, {
      transferIds: _transferIds
    })

    await Promise.all(_transferIds.map(async (transferId: string) => {
      await this.db.transfers.update(transferId, {
        transferRootHash,
        transferRootId
      })
    }))

    await this.checkTransferRootSettledState(transferRootId, multipleWithdrawalsSettledTotalAmount, bonder)
  }

  async populateTransferRootTransferIds (transferRootId: string) {
    const logger = this.logger.create({ root: transferRootId })
    logger.debug('starting populateTransferRootTransferIds')
    const dbTransferRoot = await this.db.transferRoots.getByTransferRootId(transferRootId)
    if (!dbTransferRoot) {
      throw new Error('expected db transfer root item')
    }
    const { transferRootHash, sourceChainId, destinationChainId, totalAmount, commitTxBlockNumber, transferIds: dbTransferIds } = dbTransferRoot

    if (
      (dbTransferIds !== undefined && dbTransferIds.length > 0) ||
      !(sourceChainId && destinationChainId && commitTxBlockNumber && totalAmount) ||
      isL1ChainId(sourceChainId)
    ) {
      logger.debug('populateTransferRootTransferIds already found')
      return
    }

    let transferIds = await this.checkTransferRootFromDb(transferRootId)
    if (!transferIds) {
      transferIds = await this.checkTransferRootFromChain(transferRootId)
    }

    if (transferIds?.length) {
      await this.db.transferRoots.update(transferRootId, {
        transferIds,
        totalAmount,
        sourceChainId
      })
    }
  }

  async checkTransferRootFromDb (transferRootId: string) {
    const logger = this.logger.create({ root: transferRootId })
    const dbTransferRoot = await this.db.transferRoots.getByTransferRootId(transferRootId)
    if (!dbTransferRoot) {
      throw new Error('expected db transfer root item')
    }
    const { transferRootHash } = dbTransferRoot
    if (!transferRootHash) {
      throw new Error('expected transfer root hash')
    }
    logger.debug(
      `looking in db for transfer ids for transferRootHash ${transferRootHash}`
    )
    const items = await this.db.transfers.getTransfersWithTransferRootHash(transferRootHash)
    if (items.length) {
      const transferIds = items.map((item: Transfer) => item.transferId)
      if (transferIds.length) {
        const tree = new MerkleTree(transferIds)
        const computedTransferRootHash = tree.getHexRoot()
        if (computedTransferRootHash === transferRootHash) {
          logger.debug(
            `found db transfer ids in db for transferRootHash ${transferRootHash}`
          )
          return transferIds
        }
      }
    }

    logger.debug(
      `no db transfer ids found for transferRootHash ${transferRootHash}`
    )
  }

  async lookupTransferIds (sourceBridge: L2Bridge, transferRootHash: string, destinationChainId: number, endBlockNumber: number) {
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

    const { sortedTransfers, missingIndexes, lastIndex } = getSortedTransferIds(transfers, startBlockNumber)

    if (sortedTransfers) {
      logger.debug(`last index number found in transferIds list: ${lastIndex}`)
    }

    if (missingIndexes?.length) {
      logger.warn(`missing indexes from list of transferIds (${missingIndexes.length}): ${JSON.stringify(missingIndexes)}`)
    }

    const transferIds = sortedTransfers.map((x: any) => x.transferId)
    return { startEvent, endEvent, transferIds }
  }

  async checkTransferRootFromChain (transferRootId: string) {
    const logger = this.logger.create({ root: transferRootId })
    const dbTransferRoot = await this.db.transferRoots.getByTransferRootId(transferRootId)
    if (!dbTransferRoot) {
      throw new Error('expected db transfer root item')
    }
    const { transferRootHash, sourceChainId, destinationChainId, commitTxBlockNumber } = dbTransferRoot
    if (!transferRootHash) {
      throw new Error('expected transfer root hash')
    }
    if (!sourceChainId) {
      throw new Error('expected source chain id')
    }
    if (!destinationChainId) {
      throw new Error('expected destination chain id')
    }
    if (!commitTxBlockNumber) {
      throw new Error('expected commit tx block number')
    }
    if (!this.hasSiblingWatcher(sourceChainId)) {
      logger.error(`no sibling watcher found for ${sourceChainId}`)
      return
    }
    const sourceBridge = this.getSiblingWatcherByChainId(sourceChainId)
      .bridge as L2Bridge

    const eventBlockNumber: number = commitTxBlockNumber

    logger.debug(
      `looking on-chain for transfer ids for transferRootHash ${transferRootHash}`
    )

    // It is not trivial to know if a root is the first for a route. When a new chain is added to an old bridge
    // the result is that the old bridge will look all the way back to when it is deployed before ignoring the root.
    // This blocks the bonder process for many hours and uses excessive RPC calls. To avoid this, we will keep
    // a mapping of initial roots and handle them during bridge/chain setup.
    if (FirstRoots[transferRootHash]) {
      logger.warn('populateTransferRootTransferIds first root for a given route. Ignoring.')
      await this.db.transferRoots.update(transferRootId, { isNotFound: true })
      return
    }

    const { endEvent, transferIds } = await this.lookupTransferIds(sourceBridge, transferRootHash, destinationChainId, eventBlockNumber)

    if (!transferIds) {
      throw new Error('expected transfer ids')
    }

    if (!endEvent) {
      logger.warn(`populateTransferRootTransferIds no end event found for transferRootHash ${transferRootHash}. isNotFound: true`)
      await this.db.transferRoots.update(transferRootId, { isNotFound: true })
      return
    }

    logger.debug(`transfer ids: ${JSON.stringify(transferIds)}}`)

    const tree = new MerkleTree(transferIds)
    const computedTransferRootHash = tree.getHexRoot()
    if (computedTransferRootHash !== transferRootHash) {
      logger.warn(
        `populateTransferRootTransferIds computed transfer root hash doesn't match. Expected ${transferRootHash}, got ${computedTransferRootHash}. isNotFound: true, List: ${JSON.stringify(transferIds)}`
      )
      await this.db.transferRoots.update(transferRootId, { isNotFound: true })
      return
    }

    logger.debug(
      `found transfer ids for transfer root hash ${transferRootHash}`,
      JSON.stringify(transferIds)
    )

    await Promise.all(transferIds.map(async (transferId: string) => {
      await this.db.transfers.update(transferId, {
        transferRootHash,
        transferRootId
      })
    }))

    return transferIds
  }

  async handleMultipleWithdrawalsSettledEvent (event: MultipleWithdrawalsSettledEvent) {
    const {
      bonder,
      rootHash: transferRootHash,
      totalBondsSettled
    } = event.args
    const { transactionHash, logIndex, blockNumber, transactionIndex } = event
    const dbTransferRoot = await this.db.transferRoots.getByTransferRootHash(transferRootHash)
    // Throwing here is not ideal, but it is required because we don't have the context of the transferId
    // with this event data. We can only get it from prior events. We should always see other events
    // first, but in the case where we completely miss an event, we will explicitly throw here.
    if (!dbTransferRoot?.transferRootId) {
      throw new Error(`expected db item for transfer root hash "${transferRootHash}"`)
    }

    const { transferRootId } = dbTransferRoot
    const logger = this.logger.create({ root: transferRootId })

    logger.debug('handling MultipleWithdrawalsSettled event')
    logger.debug(`tx hash from event: ${transactionHash}`)
    logger.debug(`transferRootHash from event: ${transferRootHash}`)
    logger.debug(`bonder : ${bonder}`)
    logger.debug(`totalBondSettled: ${this.bridge.formatUnits(totalBondsSettled)}`)

    await this.db.transferRoots.updateMultipleWithdrawalsSettledEvent({
      transferRootHash,
      transferRootId,
      bonder,
      totalBondsSettled,
      txHash: transactionHash,
      blockNumber,
      txIndex: transactionIndex,
      logIndex
    })

    const transferIds = dbTransferRoot?.transferIds
    if (!transferIds) {
      return
    }

    const multipleWithdrawalsSettledTotalAmount = await this.db.transferRoots.getMultipleWithdrawalsSettledTotalAmount(transferRootId)

    await this.checkTransferRootSettledState(transferRootId, multipleWithdrawalsSettledTotalAmount, bonder)
  }

  handleWithdrawalBondSettledEvent = async (event: WithdrawalBondSettledEvent) => {
    const { transactionHash } = event
    const {
      bonder,
      transferId,
      rootHash: transferRootHash
    } = event.args
    const logger = this.logger.create({ id: transferId })

    const dbTransfer = await this.db.transfers.getByTransferId(transferId)
    if (!dbTransfer) {
      logger.warn(`transfer id ${transferId} db item not found`)
      return
    }

    logger.debug('handling WithdrawalBondSettled event')
    logger.debug(`tx hash from event: ${transactionHash}`)
    logger.debug(`transferRootHash from event: ${transferRootHash}`)
    logger.debug(`bonder : ${bonder}`)
    logger.debug(`transferId: ${transferId}`)

    await this.db.transfers.update(transferId, {
      transferRootHash,
      withdrawalBondSettledTxHash: transactionHash
    })
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

  public getIsDbTransfersAllSettled (dbTransfers: Transfer[]) {
    const allBondableTransfersSettled = dbTransfers.every(
      (dbTransfer: Transfer) => {
        const isAlreadySettled = dbTransfer?.withdrawalBondSettled
        // Check that isBondable has been explicitly set to false.
        // Checking !dbTransfer.isBondable is not correct since isBondable can be undefined
        const isExplicitySetUnbondable = dbTransfer?.isBondable === false
        return isAlreadySettled || isExplicitySetUnbondable // eslint-disable-line @typescript-eslint/prefer-nullish-coalescing
      }
    )

    return allBondableTransfersSettled
  }

  async pollGasCost () {
    if (!this.gasCostPollEnabled) {
      return
    }
    this.logger.debug(`starting pollGasCost, chainSlug: ${this.chainSlug}`)
    const bridgeContract = this.bridge.bridgeWriteContract.connect(getRpcProvider(this.chainSlug)!) as L1BridgeContract | L2BridgeContract
    const amount = BigNumber.from(10)
    const amountOutMin = BigNumber.from(0)
    const bonderFee = BigNumber.from(1)
    const staker = await this.bridge.getBonderAddress()
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
            from: staker
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
              from: staker
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
          await this.db.gasCost.update({
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
          })
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
