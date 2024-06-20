import { EventEmitter } from 'node:events'
import { OnchainEventIndexerDB } from '#cctp/db/OnchainEventIndexerDB.js'
import type {
  DecodedLogWithContext,
  RequiredEventFilter,
  RequiredFilter
} from '../types.js'
import { getRpcProvider } from '#utils/getRpcProvider.js'
import { poll } from '../utils.js'
import { providers } from 'ethers'
import { POLL_INTERVAL_MS, DATA_STORED_EVENT } from './constants.js'
import { getMaxBlockRangePerIndex, getUniqueFilterId } from './utils.js'
import { IOnchainEventIndexer } from './IOnchainEventIndexer.js'
import { getChain } from '@hop-protocol/sdk'
import { DATA_PUT_EVENT } from '../db/constants.js'

/**
 * Onchain event indexer. A single instance of this class is responsible for
 * indexing as many events as needed.
 *
 * Formats data into a filterId for use by the DB. The filterId is a unique
 * identifier for the event and is used to store and retrieve indexed data.
 *
 * The DB is not concerned with the specifics of the event, only the filterId.
 *
 * @dev The consumer should call addIndexer() for all indexers they want
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

export abstract class OnchainEventIndexer<T, U, LookupKey extends string> implements IOnchainEventIndexer<T, U> {
  readonly #eventEmitter: EventEmitter = new EventEmitter()
  readonly #db: OnchainEventIndexerDB
  readonly #indexerEventFilters: IndexerEventFilter<LookupKey>[] = []
  readonly #pollIntervalMs: number = POLL_INTERVAL_MS
  #started: boolean = false
  #initialSyncComplete: Record<string, boolean> = {}

  protected abstract getIndexerEventFilter(state: T, value: U): IndexerEventFilter<LookupKey>
  protected abstract getLookupKeyValue(lookupKey: LookupKey, value: U): string
  protected abstract addDecodedTypesAndContextToEvent(log: providers.Log, chainId: string): DecodedLogWithContext
  // NOTE: This is not meant to persist after CCTP. All events should either be indexable in the filter for the getLogs
  // call or the event shouldn't need to be observed.
  protected abstract filterIrrelevantLog(log: DecodedLogWithContext): boolean

  constructor (dbName: string) {
    this.#db = new OnchainEventIndexerDB(dbName)
  }

  protected addIndexerEventFilter (indexerEventFilter: IndexerEventFilter<LookupKey>): void {
    if (this.#started) {
      throw new Error('Cannot add indexer after starting')
    }
    const filterId = getUniqueFilterId(indexerEventFilter)
    this.#db.newIndexerDB(filterId, indexerEventFilter.lookupKeys)
    this.#indexerEventFilters.push(indexerEventFilter)
  }

  /**
   * Initialization
   */

  async init (): Promise<void> {
    this.#startListeners()
    this.#db.init()
    for (const indexerEventFilter of this.#indexerEventFilters) {
      const { chainId, startBlockNumber } = indexerEventFilter 
      const filterId = getUniqueFilterId(indexerEventFilter)
      await this.#db.initializeIndexer(filterId, chainId, startBlockNumber)
    }
    console.log('OnchainEventIndexer initialized')
  }

  start (): void {
    for (const indexerEventFilter of this.#indexerEventFilters) {
      this.#startPoller(indexerEventFilter)
    }
    this.#started = true
    console.log('OnchainEventIndexer started')
  }

  /**
   * Node events
   */

  #startListeners(): void {
    this.#db.on(DATA_PUT_EVENT, (data: any) => this.#eventEmitter.emit(DATA_STORED_EVENT, data))
    this.#db.on('error', () => { throw new Error('Onchain event indexer error') })
  }

  on (event: string, listener: (...args: any[]) => void): void {
    this.#eventEmitter.on(event, listener)
  }

  /**
   * Getters
   */

  async retrieveItem(key: T, value: U): Promise<DecodedLogWithContext> {
    const indexerEventFilter = this.getIndexerEventFilter(key, value)
    const lookupKeyValues: string[] = this.#getLookupKeyValues(key, value)
    const filterId = getUniqueFilterId(indexerEventFilter)
    return this.#db.getIndexedItem(filterId, lookupKeyValues)
  }

  #getLookupKeyValues (key: T, value: U): string[] {
    const lookupKeys: LookupKey[] = this.getIndexerEventFilter(key, value).lookupKeys
    return lookupKeys.map((lookupKey: LookupKey) => {
      return this.getLookupKeyValue(lookupKey, value)
    })
  }

  /**
   * Poller
   */

  #startPoller (indexerEventFilter: IndexerEventFilter): void {
    poll(() => this.#syncEvents(indexerEventFilter), this.#pollIntervalMs)
  }

  #syncEvents = async (indexerEventFilter: IndexerEventFilter): Promise<void> => {
    const { chainId, filter } = indexerEventFilter
    const filterId = getUniqueFilterId(indexerEventFilter)
    const lastBlockSynced = await this.#db.getLastBlockSynced(filterId)
    const chainSlug = getChain(chainId).slug
    const provider = getRpcProvider(chainSlug)

    // Add 1 to currentEnd to avoid fetching the same block twice
    const startBlockNumber = lastBlockSynced + 1
    const endBlockNumber = await provider.getBlockNumber()
    const isSynced = startBlockNumber > endBlockNumber
    if (isSynced) return

    const getEventLogsInput: EventLogsForRange = {
      chainId,
      filter,
      startBlockNumber,
      endBlockNumber
    }

    for await (const { endBlockNumber, logs } of this.#getEventLogsForRange(getEventLogsInput)) {
      const filteredLogs = logs.filter(log => this.filterIrrelevantLog(log))
      // Note: There can be an updated lastBlockSynced even if the logs are empty, so don't skip the update
      await this.#db.putItemIndexedItem(filterId, endBlockNumber, filteredLogs)
    }

    if (!this.#initialSyncComplete[filterId]) {
      this.#handleInitialSyncComplete(filterId)
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

    const chainSlug = getChain(chainId).slug
    const provider = getRpcProvider(chainSlug)
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

  /**
   * Utils
   */

  #handleInitialSyncComplete (filterId: string): void {
    // Log individual filter completion
    console.log(`Initial sync complete for filterId: ${filterId}`)
    this.#initialSyncComplete[filterId] = true

    // Check if all filters have completed initial sync and log if so
    for (const indexerEventFilter of this.#indexerEventFilters) {
      const id = getUniqueFilterId(indexerEventFilter)
      if (!this.#initialSyncComplete[id]) return
    }

    console.log('Onchain Event Indexer: Initial sync complete')
  }
}