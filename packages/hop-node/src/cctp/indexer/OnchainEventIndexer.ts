import type { ChainSlug } from '@hop-protocol/sdk'
import { getChain } from '@hop-protocol/sdk'
import type { EventFilter, providers} from 'ethers'
import { utils } from 'ethers'
import type { OnchainEventIndexerDB } from '#cctp/db/OnchainEventIndexerDB.js'
import type { LogWithChainId } from '../types.js'
import { getRpcProvider } from '#utils/getRpcProvider.js'
import { wait } from '#utils/wait.js'

export type RequiredEventFilter = Required<EventFilter>
export type RequiredFilter = Required<providers.Filter>

/**
 * Returns data in the form of LogWithChainId. 
 */

export abstract class OnchainEventIndexer {
  #db: OnchainEventIndexerDB = new OnchainEventIndexerDB('TODO')
  #eventFilter: RequiredEventFilter
  #chain: ChainSlug
  #indexName: string

  // TODO: config option
  readonly #maxBlockRange: number = 2000
  // TODO: Timing
  // TODO: SLow down
  readonly #pollIntervalMs: number = 10_000

  // TODO
  protected abstract handleEvent?(topic: string, data: any): any

  protected initIndexer (
    chain: ChainSlug,
    eventFilter: RequiredEventFilter,
    indexName: string
  ) {
    this.#chain = chain
    this.#eventFilter = eventFilter
    this.#indexName = indexName
  }

  start(): void {
    this.#startListeners()
    this.#startPoller()
  }

  #startListeners = () => {
    // https://github.com/Level/abstract-level?tab=readme-ov-file#write
    this.#db.on('write', (operations: any) => {
      for (const op of operations) {
        if (op.type !== 'put') continue
        this.handleEvent?.(op.key, op.value)
      }
    })
  }

  /**
   * Public methods
   */

  protected getItem(eventSig: string, chainId: string, index: string): Promise<any> {
    return this.#db.getItem(eventSig, chainId, index)
  }

  async getIndexedDataBySecondIndex(firstIndex: string, secondIndex: string): Promise<LogWithChainId | undefined> {
    for await (const log of this.#db.getLogsByTopicAndSecondaryIndex(firstIndex, secondIndex)) {
      return log
    }
  }

  /**
   * Poller
   */

  #startPoller = async (): Promise<never> => {
    try {
      while (true) {
        await this.#syncEvents(this.#chain)

        await wait(this.#pollIntervalMs)
      }
    } catch (err) {
      console.error('OnchainEventIndexer poll err', err)
      process.exit(1)
    }
  }

  #syncEvents = async (chain: ChainSlug): Promise<void> => {
    const chainId = getChain(chain).chainId
    const filterId = this.#getUniqueFilterId(chainId, this.#eventFilter)
    const lastBlockSynced = await this.#db.getLastBlockSynced(chainId, filterId)
    const { endBlockNumber, logs } = await getEventsInRange(chain, this.#eventFilter, lastBlockSynced, this.#maxBlockRange)

    // Atomically write new DB state and logs to avoid out of sync state
    await this.#db.updateSyncAndEvents(filterId, endBlockNumber, logs)
  }

  // FilterID is unique per chain and event filter. The filter can technically match on multiple chains.
  #getUniqueFilterId = (chainId: string, eventFilter: RequiredEventFilter): string => {
    const chainSlug = getChain(chainId).slug
    const bytesId = utils.toUtf8Bytes(chainSlug + JSON.stringify(eventFilter))
    return utils.keccak256(bytesId)
  }
}

// TODO: organize, don't love that anyone can consume. should be tightly controlled
// TODO: getEvents? or getLogs? better name?
// TODO: Max block range not constant
export async function getEventsInRange (
  chain: ChainSlug,
  eventFilter: RequiredEventFilter,
  syncStartBlock: number,
  maxBlockRange: number = 2_000
): Promise<{
  endBlockNumber: number,
  logs: LogWithChainId[]
}> {
  const chainId = getChain(chain).chainId
  const provider = getRpcProvider(chain)

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
      ...eventFilter,
      fromBlock: currentStart,
      toBlock: currentEnd
    }
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