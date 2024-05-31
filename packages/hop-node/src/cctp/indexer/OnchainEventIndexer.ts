import { EventEmitter } from 'node:events'
import { OnchainEventIndexerDB } from '#cctp/db/OnchainEventIndexerDB.js'
import type { LogWithChainId, RequiredFilter } from '../types.js'
import { getRpcProvider } from '#utils/getRpcProvider.js'
import { wait } from '#utils/wait.js'
import { utils } from 'ethers'
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

  #startListeners = () => {
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
    const { endBlockNumber, logs } = await this.#getEventsInRange(chainId, eventSig, eventContractAddress, lastBlockSynced)

    // Atomically write new DB state and logs to avoid out of sync state
    await this.#db.updateIndexedData(filterId, endBlockNumber, logs, indexNames)
  }


  /**
   * Indexer
   */

  #getEventsInRange = async (
    chainId: string,
    eventSig: string,
    eventContractAddress: string,
    syncStartBlock: number
  ): Promise<{
    endBlockNumber: number,
    logs: LogWithChainId[]
  }> => {
    const provider = getRpcProvider(chainId)
    const lastBlockSynced = syncStartBlock
    const headBlockNumber = await provider.getBlockNumber()

    // Avoid double counting the edges
    let currentStart = lastBlockSynced + 1
    if (currentStart >= headBlockNumber) {
      return {
        endBlockNumber: lastBlockSynced,
        logs: []
      }
    }

    // TODO: logs.push() could load up too much in memory -- consider updating DB in chunks or streaming
    const maxBlockRange = this.#getMaxBlockRangePerIndex(chainId)
    const logsWithChainId: LogWithChainId[] = []
    let currentEnd: number = 0
    while (currentStart < headBlockNumber) {
      currentEnd = Math.min(currentStart + maxBlockRange, headBlockNumber)

      const filter: RequiredFilter = {
        topics: [eventSig],
        address: eventContractAddress,
        fromBlock: currentStart,
        toBlock: currentEnd
      }

      // TODO: Get decoded log from SDK
      const logs = await provider.getLogs(filter)
      for (const log of logs) {
        const logWithChainId = { ...log, chainId }
        logsWithChainId.push(logWithChainId)
      }

      currentStart = currentEnd
    }

    return {
      endBlockNumber: currentEnd,
      logs: logsWithChainId
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