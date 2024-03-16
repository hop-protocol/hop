import chainIdToSlug from 'src/utils/chainIdToSlug'
import chainSlugToId from 'src/utils/chainSlugToId'
import { Chain } from 'src/constants'
import { EventFilter, providers, utils } from 'ethers'
import { IGetIndexedDataByKey } from './types'
import { type LogWithChainId, OnchainEventIndexerDB } from 'src/cctp/db/OnchainEventIndexerDB'
import { getRpcProvider } from 'src/utils/getRpcProvider'

export type RequiredEventFilter = Required<EventFilter>
export type RequiredFilter = Required<providers.Filter>

export class OnchainEventIndexer implements IGetIndexedDataByKey {
  readonly #db: OnchainEventIndexerDB
  readonly #eventFilter: RequiredEventFilter

  // TODO: config option
  readonly #maxBlockRange: number = 1000
  readonly #pollIntervalMs: number = 60_000

  constructor (
    eventFilter: RequiredEventFilter,
    chain: Chain
  ) {
    this.#db = new OnchainEventIndexerDB('OnchainEventIndexer')
    this.#eventFilter = eventFilter

    this.#initPoller(chain)
  }

  // TODO: When the DB supports multiple indexes, remove the topic
  async getIndexedDataByKey(key: string, topic: string): Promise<LogWithChainId[] | undefined> {
    // TODO: When the DB supports multiple indexes, replace this with a call to the DB and remove the topic
    return this.#getLogsForSecondaryIndex(key, topic)
  }

  // TODO: When the DB supports multiple indexes, remove this
  async #getLogsForSecondaryIndex (key: string, topic: string): Promise<LogWithChainId[] | undefined> {
    if (!topic || Array.isArray(topic)){
      throw new Error('Topic must be string')
    }

    for await (const log of this.#db.getLogsByTopic(topic)) {
      if (log.data === key) {
        return [log]
      }
    }
  }

  #initPoller = async (chain: Chain) => {
    setTimeout(() => this.#syncEvents(chain), this.#pollIntervalMs)
  }

  #syncEvents = async (chain: Chain): Promise<void> => {
    const chainId = chainSlugToId(chain)
    const provider = getRpcProvider(chain)
    const filterId = this.#getUniqueFilterId(chainId, this.#eventFilter)

    const lastBlockSynced = await this.#db.getLastBlockSynced(chainId, filterId)
    const headBlockNumber = await provider.getBlockNumber()

    // Avoid double counting the edges
    let currentStart = lastBlockSynced + 1
    if (currentStart >= headBlockNumber) {
      return
    }

    // TODO: logs.push() could load up too much in memory -- consider updating DB in chunks or streaming
    const logsWithChainId: LogWithChainId[] = []
    let currentEnd: number = 0
    while (currentStart < headBlockNumber) {
      currentEnd = Math.min(currentStart + this.#maxBlockRange, headBlockNumber)

      const filter: RequiredFilter = {
        ...this.#eventFilter,
        fromBlock: currentStart,
        toBlock: currentEnd
      }
      const logs = await provider.getLogs(filter)
      for (const log of logs) {
        const logWithChainId = { ...log, chainId }
        logsWithChainId.push(logWithChainId)
      }
    }
    currentStart = currentEnd

    // Atomically write new DB state and logs to avoid out of sync state
    await this.#db.updateSyncAndEvents(filterId, currentEnd, logsWithChainId)
  }

  // FilterID is unique per chain and event filter. The filter can technically match on multiple chains.
  #getUniqueFilterId = (chainId: number, eventFilter: RequiredEventFilter): string => {
    const chainSlug = chainIdToSlug(chainId)
    const bytesId = utils.toUtf8Bytes(chainSlug + JSON.stringify(eventFilter))
    return utils.keccak256(bytesId)
  }
}
