import { ChainedBatch, DB } from './DB'
import { providers } from 'ethers'

export type LogWithChainId = providers.Log & { chainId: number }

type DBValue = LogWithChainId | number

/**
 * Future work:
 * - Add secondary index for event in the form of <topic[0]!secondaryTopic, Log>
 */

/**
 * Indexed by topic[0]!chainId!blockNumber!logIndex
 */

export class OnchainEventIndexerDB extends DB<string, DBValue> {

  async *getLogsByTopic(topic: string): AsyncIterable<LogWithChainId> {
     // Tilde is intentional for lexicographical sorting
    const filter = {
      gte: `${topic}`,
      lt: `${topic}~`
    }
    yield* this.values(filter)
  }

  async getLastBlockSynced(syncDbKey: string): Promise<number> {
    // TODO: Not 0, get start block num from config
    return (await this.get(this.encodeKey(syncDbKey)) ?? 0) as number
  }

  async updateSyncAndEvents(syncDbKey: string, syncedBlockNumber: number, logs: LogWithChainId[]): Promise<void> {
    const batch: ChainedBatch<this, string, DBValue> = this.batch()

    for (const log of logs) {
      const index = this.#getIndexKey(log)
      batch.put(index, log)
    }

    //  These must be performed atomically to keep state in sync
    batch.put(syncDbKey, syncedBlockNumber)
    return batch.write()
  }

  #getIndexKey (log: LogWithChainId): string {
    // Use ! as separator since it is best choice for lexicographical ordering and follows best practices
    // https://github.com/Level/subleveldown
    return log.topics[0] + '!' + log.chainId + '!' + log.blockNumber + '!' + log.logIndex
  }
}
