import { EventEmitter } from 'node:events'
import { OnchainEventIndexerDB } from '#cctp/db/OnchainEventIndexerDB.js'
import type { LogWithChainId, RequiredFilter } from '../types.js'
import { getRpcProvider } from '#utils/getRpcProvider.js'
import { wait } from '#utils/wait.js'
import { providers, utils } from 'ethers'
import { getChain } from '@hop-protocol/sdk'
import {
  DATA_INDEXED_EVENT,
  MAX_BLOCK_RANGE_PER_INDEX,
  POLL_INTERVAL_MS
} from './constants.js'

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

export interface IndexerData<T extends string[] = string[]> {
  chainId: string
  eventSig: string
  eventContractAddress: string
  indexNames: T
}

interface EventLogsForRange {
  chainId: string
  eventSig: string
  eventContractAddress: string
  startBlockNumber: number
  endBlockNumber: number
}

export abstract class OnchainEventIndexer {
  readonly #eventEmitter: EventEmitter = new EventEmitter()
  readonly #db: OnchainEventIndexerDB
  readonly #indexerDatas: IndexerData[] = []
  readonly #pollIntervalMs: number = POLL_INTERVAL_MS
  #started: boolean = false

  protected abstract getIndexerData(chainId: string, opts: any): IndexerData

  constructor (dbName: string) {
    this.#db = new OnchainEventIndexerDB(dbName)
  }

  protected addIndexer (indexerData: IndexerData): void {
    if (this.#started) {
      throw new Error('Cannot add indexer after starting')
    }
    const filterId = this.#getUniqueFilterId(indexerData)
    this.#db.newIndexerDB(filterId)
    this.#indexerDatas.push(indexerData)
  }

  async init(): Promise<void> {
    for (const indexerData of this.#indexerDatas) {
      const { chainId } = indexerData
      const filterId = this.#getUniqueFilterId(indexerData)
      await this.#db.init(filterId, chainId)
    }
  }

  start(): void {
    this.#startListeners()
    for (const indexerData of this.#indexerDatas) {
      this.#startPoller(indexerData)
    }
    this.#started = true
  }

  /**
   *  Event Handling
   */

  #startListeners = (): void => {
    // Emit event when data is written to the DB
    // https://github.com/Level/abstract-level?tab=readme-ov-file#write
    this.#db.on('write', (operations: any) => {
      for (const op of operations) {
        if (op.type !== 'put') continue
        this.#eventEmitter.emit(DATA_INDEXED_EVENT, op.value)
      }
    })
  }

  on (event: string, listener: (...args: any[]) => void): void {
    this.#eventEmitter.on(event, listener)
  }

  /**
   * Public methods
   */

  protected getItem(indexerData: IndexerData, indexValues: string[]): Promise<LogWithChainId> {
    const filterId = this.#getUniqueFilterId(indexerData)
    return this.#db.getIndexedItem(filterId, indexValues)
  }

  /**
   * Poller
   */

  #startPoller = async (indexerData: IndexerData): Promise<never> => {
    while (true) {
      try {
        await this.#syncEvents(indexerData)
        await wait(this.#pollIntervalMs)
      } catch (err) {
        const filterId = this.#getUniqueFilterId(indexerData)
        console.error(`OnchainEventIndexer poll err for filterId: ${filterId}: ${err}`)
        process.exit(1)
      }
    }
  }

  #syncEvents = async (indexerData: IndexerData): Promise<void> => {
    const { chainId, eventSig, eventContractAddress, indexNames } = indexerData
    const filterId = this.#getUniqueFilterId(indexerData)
    const lastBlockSynced = await this.#db.getLastBlockSynced(filterId)
    const provider = getRpcProvider(chainId)

    // Add 1 to currentEnd to avoid fetching the same block twice
    const startBlockNumber = lastBlockSynced + 1
    const endBlockNumber = await provider.getBlockNumber()
    const getEventLogsInput: EventLogsForRange = {
      chainId,
      eventSig,
      eventContractAddress,
      startBlockNumber,
      endBlockNumber
    }

    // If the indexer is synced, do nothing
    if (startBlockNumber >= endBlockNumber) return

    for await (const { endBlockNumber, logs } of this.#getEventLogsForRange(getEventLogsInput)) {
      // Atomically write new DB state and logs to avoid out of sync state
      // Note: There can be an updated lastBlockSynced even if the logs are empty, so don't skip the update
      await this.#db.updateIndexedData(filterId, endBlockNumber, logs, indexNames)
    }
  }

  /**
   * Indexer
   */

  // TODO: General logs, not any. I add chainId at a later time
  async *#getEventLogsForRange (input: EventLogsForRange): AsyncIterable<{
    endBlockNumber: number,
    logs: LogWithChainId[]
  }> {
    const { chainId, eventSig, eventContractAddress, startBlockNumber, endBlockNumber } = input
    if (startBlockNumber > endBlockNumber) {
      throw new Error('startBlockNumber must be less than or equal to endBlockNumber')
    }

    // Config
    const provider = getRpcProvider(chainId)
    const maxBlockRange = this.#getMaxBlockRangePerIndex(chainId)

    // Fetch logs in chunks
    let currentStartBlockNumber: number = startBlockNumber
    while (currentStartBlockNumber <= endBlockNumber) {
      const currentEndBlockNumber = Math.min(currentStartBlockNumber + maxBlockRange, endBlockNumber)

      const filter: RequiredFilter = {
        topics: [eventSig],
        address: eventContractAddress,
        fromBlock: currentStartBlockNumber,
        toBlock: currentEndBlockNumber 
      }

      const logs: providers.Log[] = await provider.getLogs(filter)
      const logsWithChainId: LogWithChainId[] = logs.map(log => ({ ...log, chainId }))
      yield  {
        endBlockNumber: currentEndBlockNumber,
        logs: logsWithChainId
      }

      currentStartBlockNumber = currentEndBlockNumber + 1
    }
  }

  /**
   * Internal
   */

  #getUniqueFilterId = (indexerData: IndexerData): string => {
    const { chainId, eventSig, eventContractAddress } = indexerData
    return utils.keccak256(`${chainId}${eventSig}${eventContractAddress}`)
  }

  #getMaxBlockRangePerIndex(chainId: string): number {
    const chainSlug = getChain(chainId).slug
    return MAX_BLOCK_RANGE_PER_INDEX[chainSlug]
  }
}