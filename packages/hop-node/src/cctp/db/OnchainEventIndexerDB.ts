import { type ChainedBatch } from 'classic-level'
import { DB, DBKeyEncodingOptions } from './DB.js'
import { providers } from 'ethers'

export type LogWithChainId = providers.Log & { chainId: number }

/**
 * Future work:
 * - Add secondary index for event in the form of <topic[0]!secondaryTopic, Log>
 */

/**
 * Indexed by topic[0]!chainId!blockNumber!logIndex
 */

export class OnchainEventIndexerDB extends DB {

  async *getLogsByTopic(topic: string): AsyncIterable<LogWithChainId> {
     // Tilde is intentional for lexicographical sorting
    const filter = {
      ...DBKeyEncodingOptions,
      gte: `${topic}`,
      lt: `${topic}~`
    }
    yield* this.values(filter)
  }

  async getLastBlockSynced(syncDbKey: string): Promise<number> {
    // TODO: Not 0, get start block num from config
    return parseInt(await this.get(syncDbKey) ?? 0)
  }

  async updateSyncAndEvents(syncDbKey: string, syncedBlockNumber: number, logs: LogWithChainId[]): Promise<void> {
    const batch: ChainedBatch<this, string, LogWithChainId | string> = this.batch()

    for (const log of logs) {
      const index = this.#getIndexKey(log)
      batch.put(index, log)
    }

    //  These must be performed atomically to keep state in sync
    batch.put(syncDbKey, syncedBlockNumber.toString())
    return batch.write()
  }

  #getIndexKey (log: LogWithChainId): string {
    // Use ! as separator since it is best choice for lexicographical ordering and follows best practices
    // https://github.com/Level/subleveldown
    return log.topics[0] + '!' + log.chainId + '!' + log.blockNumber + '!' + log.logIndex
  }
}
