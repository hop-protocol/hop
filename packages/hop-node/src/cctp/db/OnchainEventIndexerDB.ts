import { BigNumber } from 'ethers'
import { ChainedBatch, DB } from './DB'
import { Message } from '../cctp/Message'
import { getDefaultStartBlockNumber } from './utils'
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

  // TODO: Clean these up
  async *getLogsByTopic(topic: string): AsyncIterable<LogWithChainId> {
     // Tilde is intentional for lexicographical sorting
    const filter = {
      gte: `${topic}`,
      lt: `${topic}~`
    }
    yield* this.values(filter)
  }

  async *getLogsByTopicAndSecondaryIndex(topic: string, secondaryIndex: string): AsyncIterable<LogWithChainId> {
     // Tilde is intentional for lexicographical sorting
    const filter = {
      gte: `${topic}!${secondaryIndex}`,
      lt: `${topic}!${secondaryIndex}~`
    }
    
    yield* this.values(filter)
  }

  async getLastBlockSynced(chainId: number, syncDBKey: string): Promise<number> {
    // TODO: Use decorator for creation
    let dbValue = 0
    try {
      dbValue = await this.get(this.encodeKey(syncDBKey)) as number
    } catch (e) {
      // TODO: Better handling
      // Noop
    }
    const defaultStartBlockNumber = getDefaultStartBlockNumber(chainId)
    // Intentional or instead of nullish coalescing since dbValue can be 0
    return (dbValue || defaultStartBlockNumber) as number
  }

  async updateSyncAndEvents(syncDBKey: string, syncedBlockNumber: number, logs: LogWithChainId[]): Promise<void> {
    const batch: ChainedBatch<this, string, DBValue> = this.batch()

    for (const log of logs) {
      const index = this.#getIndexKey(log)
      batch.put(index, log)
      console.log('putting log', syncDBKey, syncedBlockNumber, log)

      // TODO: Temp second index, pass this in thru constructor
      if (log.topics[0] === Message.MESSAGE_RECEIVED_EVENT_SIG) {
        const secondIndex = this.#getIndexKey(log, BigNumber.from(log.topics[2]).toString())
        batch.put(secondIndex, log)
        console.log('putting secondary log', syncDBKey, syncedBlockNumber, log)
      }
    }

    //  These must be performed atomically to keep state in sync
    batch.put(syncDBKey, syncedBlockNumber)
    console.log('putting sync log', syncDBKey, syncedBlockNumber)
    return batch.write()
  }

  // TODO: Use sublevels
  #getIndexKey (log: LogWithChainId, secondIndex?: string): string {
    // Use ! as separator since it is best choice for lexicographical ordering and follows best practices
    // https://github.com/Level/subleveldown
    let index = log.topics[0]
    if (secondIndex) {
      index += '!' + secondIndex
    }
    return index + '!' + log.chainId + '!' + log.blockNumber + '!' + log.logIndex
  }
}
