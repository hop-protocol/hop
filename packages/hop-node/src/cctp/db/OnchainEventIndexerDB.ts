import { type ChainedBatch, DB } from './DB.js'
import { getDefaultStartBlockNumber } from './utils.js'
import type { LogWithChainId } from '../types.js'

type DBValue = LogWithChainId | number

/**
 * This DB should only be used to get individual items. There should never be a
 * need to iterate over all items in the DB. This is because the indexing is
 * done such that each entry is guaranteed to be unique.
 */

export class OnchainEventIndexerDB extends DB<string, DBValue> {

  constructor (dbName: string) {
    super(dbName + 'OnchainEventIndexerDB')
  }

  async newIndexerDB(key: string): Promise<void> {
    this.sublevel(key)
  }

  async init (key: string, chainId: string): Promise<void> {
    const syncKey = this.#getLastBlockSyncedKey(key)
    const doesKeyExist = await this.has(syncKey)
    if (doesKeyExist) {
      return
    }

    const defaultStartBlockNumber = getDefaultStartBlockNumber(chainId)
    await this.sublevel(key).put(syncKey, defaultStartBlockNumber.toString())
  }

  /**
   * Sync data
   */

  // @dev The value is guaranteed to exist because it is set in the init function
  async getLastBlockSynced(key: string): Promise<number> {
    try {
      const syncKey = this.#getLastBlockSyncedKey(key)
      return await this.get(syncKey) as number
    } catch (err) {
      throw new Error(`No last block synced found for key ${key}. error: ${err}`)
    }
  }

  /**
   * Index data
   */

  async getIndexedItem(key: string, indexValues: string[]): Promise<LogWithChainId> {
    const indexedValue = key + indexValues.join('!')
    return (await this.get(indexedValue)) as LogWithChainId
  }

  async updateIndexedData(key: string, syncedBlockNumber: number, logs: LogWithChainId[], indexNames: string[]): Promise<void> {
    const batch: ChainedBatch<this, string, DBValue> = this.batch()
    for (const log of logs) {
      // The indexed key grows with each index
      let indexedKey: string = ''
      for (const indexName of indexNames) {
        indexedKey = indexedKey + '!' + log[indexName]
        batch.put(indexedKey, log)
      }
    }

    // Update the last block synced
    const syncKey = this.#getLastBlockSyncedKey(key)
    batch.put(syncKey, syncedBlockNumber)

    return batch.write()
  }

  /**
   * Internal
   */

  #getLastBlockSyncedKey = (filterId: string): string => {
    return 'sync' + filterId
  }
}
