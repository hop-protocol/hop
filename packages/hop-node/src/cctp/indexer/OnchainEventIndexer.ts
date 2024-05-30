import { EventEmitter } from 'node:events'
import { OnchainEventIndexerDB } from '#cctp/db/OnchainEventIndexerDB.js'
import type { LogWithChainId, RequiredFilter } from '../types.js'
import { getRpcProvider } from '#utils/getRpcProvider.js'
import { wait } from '#utils/wait.js'
import { utils } from 'ethers'
import { DATA_INDEXED_EVENT } from './constants.js'


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

  // TODO: config option
  // TODO: Timing, slow this down
  readonly #maxBlockRange: number = 2000
  readonly #pollIntervalMs: number = 10_000

  constructor (dbName: string) {
    this.#db = new OnchainEventIndexerDB(dbName)
  }

  protected initIndexer (indexerData: IndexerData): void {
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
    const { endBlockNumber, logs } = await this.#getEventsInRange(
      chainId,
      eventSig,
      eventContractAddress,
      lastBlockSynced,
      this.#maxBlockRange
    )

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
    syncStartBlock: number,
    maxBlockRange: number = 2_000
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

  #getUniqueFilterId = (indexerData: IndexerData): string => {
    const { chainId, eventSig, eventContractAddress } = indexerData
    return utils.keccak256(`${chainId}${eventSig}${eventContractAddress}`)
  }
}