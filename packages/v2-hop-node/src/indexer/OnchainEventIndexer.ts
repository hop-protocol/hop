import { EventEmitter } from 'node:events'
import { OnchainEventIndexerDB } from '#db/OnchainEventIndexerDB.js'
import type {
  DecodedLogWithContext,
  IndexedEventData,
  RequiredEventFilter,
  RequiredFilter
} from '#types/index.js'
import { getRpcProvider } from '#utils/getRpcProvider.js'
import { poll } from '#utils/poll.js'
import type { providers } from 'ethers'
import { DATA_PROCESSED_EVENT } from '#constants/index.js'
import {
  getMaxBlockRangePerIndex,
  getIndexerSyncBlockNumber,
  getUniqueFilterId,
  stringifyObjectValues
} from './utils.js'
import { filterObjectProperties } from '#utils/filterObjectProperties.js'
import type { IOnchainEventIndexer } from './IOnchainEventIndexer.js'
import { DATA_PUT_EVENT } from '#db/constants.js'
import { Logger } from '#logger/index.js'

/**
 * A single instance of this class is responsible for indexing as many events as needed.
 *
 * Formats data into a filterId for use by the DB. The filterId is unique per event and chain.
 *
 * The DB is not concerned with the specifics of the event.
 *
 * @dev The consumer must call addIndexer() for all indexers they want
 * to use before calling init() and start().
 */

export interface IndexerEventFilter<T extends string = string>{
  chainId: string
  filter: RequiredEventFilter
  startBlockNumber: number
  lookupKeys: T[]
}

interface EventLogsForRange {
  chainId: string
  filter: RequiredEventFilter
  startBlockNumber: number
  endBlockNumber: number
}

export abstract class OnchainEventIndexer<LookupKey extends string> implements IOnchainEventIndexer {
  readonly #eventEmitter: EventEmitter = new EventEmitter()
  readonly #db: OnchainEventIndexerDB
  readonly #indexerEventFilters: IndexerEventFilter<LookupKey>[] = []
  // TODO: Optimize: Poll timing, possibly two-tiered polling or per-indexer polling. PollPriority can be passed into class.
  // This poller calls a getLog for each indexed event filter every poll. This can become RPC intensive and the value
  // should reflect the tradeoff between up-to-date data and RPC usage.
  readonly #pollIntervalMs: number = 30_000
  #initialized: boolean = false
  #started: boolean = false
  protected readonly logger: Logger

  protected abstract getEventFilter(chainId: string, eventName: string): RequiredEventFilter
  protected abstract getLookupKeysByEventName(eventName: string): LookupKey[]
  protected abstract addDecodedTypesAndContextToEvent(log: providers.Log, chainId: string): DecodedLogWithContext
  // NOTE: All events should either be indexable in the filter for the getLogs call or the event shouldn't need to be observed.
  // This exists for systems that are required to observe all events but only index some, like CCTP. This should be overridden
  // by those systems, but nearly all other systems should return true, which is why it's not abstract.
  protected filterIrrelevantLog(log: DecodedLogWithContext): boolean {
    return true
  }

  constructor (dbName: string) {
    this.#db = new OnchainEventIndexerDB(dbName)
    this.logger = new Logger({
      tag: 'OnchainEventIndexer',
      color: 'blue'
    })
  }

  protected addIndexerEventFilter (indexerEventFilter: IndexerEventFilter<LookupKey>): void {
    if (this.#initialized || this.#started) {
      throw new Error('Cannot add indexer after initializing or starting')
    }
    const { chainId, filter, lookupKeys } = indexerEventFilter
    const filterId = getUniqueFilterId(chainId, filter)
    this.#db.newIndexerDB(filterId, lookupKeys)
    this.#indexerEventFilters.push(indexerEventFilter)
  }

  /**
   * Initialization
   */

  async init (): Promise<void> {
    this.#initListeners()
    this.#db.init()

    // Parallelize initialization and syncing since each filter is independent
    const promises: Array<Promise<void>> = this.#indexerEventFilters.map(async (indexerEventFilter) => {
      const { chainId, filter, startBlockNumber } = indexerEventFilter
      const filterId = getUniqueFilterId(chainId, filter)
      await this.#db.initializeIndexer(filterId, chainId, startBlockNumber)
      await this.#syncEvents(indexerEventFilter)
    })
    await Promise.all(promises)

    this.#initialized = true
    this.logger.info('OnchainEventIndexer initialized')
  }

  start (): void {
    for (const indexerEventFilter of this.#indexerEventFilters) {
      this.#startPoller(indexerEventFilter)
    }
    this.#started = true
    this.logger.info('OnchainEventIndexer started')
  }

  /**
   * Node events
   */

  #initListeners(): void {
    this.#db.on(DATA_PUT_EVENT, (data: any) => this.#eventEmitter.emit(DATA_PROCESSED_EVENT, data))
    this.#db.on('error', () => { throw new Error('Onchain event indexer error') })
  }

  on (event: string, listener: (...args: any[]) => void): void {
    this.#eventEmitter.on(event, listener)
  }

  /**
   * Getters
   */

  async fetchItem(indexedEventData: IndexedEventData): Promise<DecodedLogWithContext | null> {
    const { chainId, eventName, eventIndexes } = indexedEventData

    const eventFilter: RequiredEventFilter = this.getEventFilter(chainId, eventName)
    const filterId: string = getUniqueFilterId(chainId, eventFilter)

    const lookupKeys: LookupKey[] = this.getLookupKeysByEventName(eventName)
    const indexesObj = filterObjectProperties(eventIndexes, lookupKeys)
    const stringifiedIndexValues: string[] = stringifyObjectValues(indexesObj)

    try {
      return await this.#db.getIndexedItem(filterId, stringifiedIndexValues)
    } catch {
      return null
    }
  }

  /**
   * Poller
   */

  #startPoller (indexerEventFilter: IndexerEventFilter): void {
    void poll(() => this.#syncEvents(indexerEventFilter), this.#pollIntervalMs, this.logger)
  }

  #syncEvents = async (indexerEventFilter: IndexerEventFilter): Promise<void> => {
    const { chainId, filter } = indexerEventFilter
    const filterId = getUniqueFilterId(chainId, filter)
    const lastBlockSynced = await this.#db.getLastBlockSynced(filterId)

    // Add 1 to currentEnd to avoid fetching the same block twice
    const startBlockNumber = lastBlockSynced + 1
    const endBlockNumber = await getIndexerSyncBlockNumber(chainId)
    const isSynced = startBlockNumber > endBlockNumber
    if (isSynced) return

    const getEventLogsInput: EventLogsForRange = {
      chainId,
      filter,
      startBlockNumber,
      endBlockNumber
    }

    this.logger.info(`Syncing events for chainId ${chainId} and filterId ${filterId} from block ${startBlockNumber} to ${endBlockNumber}`)
    for await (const { endBlockNumber, logs } of this.#getEventLogsForRange(getEventLogsInput)) {
      const filteredLogs = logs.filter(log => this.filterIrrelevantLog(log))
      // Note: There can be an updated lastBlockSynced even if the logs are empty, so don't skip the update
      await this.#db.putItemIndexedItem(filterId, endBlockNumber, filteredLogs)
    }
  }

  /**
   * Indexer
   */

  async *#getEventLogsForRange (input: EventLogsForRange): AsyncIterable<{
    endBlockNumber: number,
    logs: DecodedLogWithContext[]
  }> {
    const { chainId, filter: eventFilter, startBlockNumber, endBlockNumber } = input
    if (startBlockNumber > endBlockNumber) {
      throw new Error('startBlockNumber must be less than or equal to endBlockNumber')
    }

    const provider = getRpcProvider(chainId)
    const maxBlockRange = getMaxBlockRangePerIndex(chainId)

    // Fetch logs in chunks
    let currentStartBlockNumber: number = startBlockNumber
    while (currentStartBlockNumber <= endBlockNumber) {
      const currentEndBlockNumber = Math.min(currentStartBlockNumber + maxBlockRange, endBlockNumber)

      const filter: RequiredFilter = {
        ...eventFilter,
        fromBlock: currentStartBlockNumber,
        toBlock: currentEndBlockNumber
      }

      const logs: providers.Log[] = await provider.getLogs(filter)
      const typedLogsWithChainId: DecodedLogWithContext[] = logs.map(log => this.addDecodedTypesAndContextToEvent(log, chainId))

      yield {
        endBlockNumber: currentEndBlockNumber,
        logs: typedLogsWithChainId
      }

      currentStartBlockNumber = currentEndBlockNumber + 1
    }
  }
}
