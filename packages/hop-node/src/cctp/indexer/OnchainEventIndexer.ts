import chainIdToSlug from 'src/utils/chainIdToSlug'
import chainSlugToId from 'src/utils/chainSlugToId'
import { Chain } from 'src/constants'
import { EventFilter, providers, utils } from 'ethers'
import { type LogWithChainId, OnchainEventIndexerDB } from 'src/cctp/db/OnchainEventIndexerDB'
import { getRpcProvider } from 'src/utils/getRpcProvider'
import { wait } from 'src/utils/wait'

export type RequiredEventFilter = Required<EventFilter>
export type RequiredFilter = Required<providers.Filter>

export class OnchainEventIndexer {
  readonly #db: OnchainEventIndexerDB
  readonly #eventFilter: RequiredEventFilter

  // TODO: config option
  readonly #maxBlockRange: number = 2000
  // TODO: Timing
  // TODO: SLow down
  readonly #pollIntervalMs: number = 10_000

  constructor (
    db: OnchainEventIndexerDB,
    eventFilter: RequiredEventFilter,
    chain: Chain
  ) {
    this.#db = db
    this.#eventFilter = eventFilter

    this.#initPoller(chain)
  }

  /**
   * Public methods
   */

  async *getAllLogsForTopic (topic: string): AsyncIterable<LogWithChainId> {
    for await (const log of this.#db.getLogsByTopic(topic)) {
      yield log
    }
  }

  async getIndexedDataBySecondIndex(firstIndex: string, secondIndex: string): Promise<LogWithChainId | undefined> {
    for await (const log of this.#db.getLogsByTopicAndSecondaryIndex(firstIndex, secondIndex)) {
      return log
    }
  }

  /**
   * Poller
   */


  #initPoller = async (chain: Chain) => {
    try {
      while (true) {
        await this.#syncEvents(chain)

        await wait(this.#pollIntervalMs)
      }
    } catch (err) {
      console.error('OnchainEventIndexer poll err', err)
      process.exit(1)
    }
  }

  #syncEvents = async (chain: Chain): Promise<void> => {
    const chainId = chainSlugToId(chain)
    const filterId = this.#getUniqueFilterId(chainId, this.#eventFilter)
    const lastBlockSynced = await this.#db.getLastBlockSynced(chainId, filterId)
    const { endBlockNumber, logs } = await getEventsInRange(chain, this.#eventFilter, lastBlockSynced, this.#maxBlockRange)

    // Atomically write new DB state and logs to avoid out of sync state
    await this.#db.updateSyncAndEvents(filterId, endBlockNumber, logs)
  }

  // FilterID is unique per chain and event filter. The filter can technically match on multiple chains.
  #getUniqueFilterId = (chainId: number, eventFilter: RequiredEventFilter): string => {
    const chainSlug = chainIdToSlug(chainId)
    const bytesId = utils.toUtf8Bytes(chainSlug + JSON.stringify(eventFilter))
    return utils.keccak256(bytesId)
  }
}

// TODO: organize, don't love that anyone can consume. should be tightly controlled
// TODO: getEvents? or getLogs? better name?
// TODO: Max block range not constant
export async function getEventsInRange (
  chain: Chain,
  eventFilter: RequiredEventFilter,
  syncStartBlock: number,
  maxBlockRange: number = 2_000
): Promise<{
  endBlockNumber: number,
  logs: LogWithChainId[]
}> {
  const chainId = chainSlugToId(chain)
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