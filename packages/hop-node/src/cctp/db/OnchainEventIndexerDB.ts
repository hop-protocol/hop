import { DB } from './DB.js'
import { getDefaultStartBlockNumber } from './utils.js'
import type { DecodedLogWithContext } from '../types.js'
import { DATA_PUT_EVENT } from './constants.js'

/**
 * This DB should only be used to get individual items. There should never be a
 * need to iterate over all items in the DB. This is because the indexing is
 * done such that each entry is guaranteed to be unique.
 * 
 * The primary key is the filterId and the secondary keys are the values that
 * are indexed by the consumer.
 * 
 * The DB stores and maintains the last block synced for each filterId.
 */


type IndexDBValue = DecodedLogWithContext
type SyncDBValue = {
  syncedBlockNumber: number
}
type DBValue = IndexDBValue | SyncDBValue

export class OnchainEventIndexerDB extends DB<string, DBValue> {
  readonly #secondaryKeys: Record<string, string[]> = {}

  constructor (dbName: string) {
    super(dbName + 'OnchainEventIndexerDB')
  }

  /**
   * Initialization
   */

  async newIndexerDB(primaryKey: string, secondaryKeys: string[]): Promise<void> {
    if (this.#secondaryKeys[primaryKey]) {
      throw new Error(`Indexer DB already exists for primaryKey ${primaryKey}`)
    }
    this.sublevel(primaryKey)
    this.#secondaryKeys[primaryKey] = secondaryKeys
  }

  async initializeIndexer (primaryKey: string, chainId: string): Promise<void> {
    const syncKey = this.#getLastBlockSyncedKey(primaryKey)
    const doesKeyExist = await this.has(syncKey)
    if (doesKeyExist) {
      return
    }

    const defaultStartBlockNumber = getDefaultStartBlockNumber(chainId)
    await this.put(syncKey, { 
      syncedBlockNumber: defaultStartBlockNumber
    })
  }

  init (): void {
    this.#startListeners()
    console.log('Onchain Event Indexer initialized')
  }

  /**
   * Node events
   */

    #startListeners = (): void => {
      // https://github.com/Level/levelup?tab=readme-ov-file#events
      this.on('batch', (operations: any[]) => {
        for (const op of operations) {
          if (op.type !== 'put') continue

          // Only emit the event if the value is not a sync value
          const isSyncPut = !!op.value?.syncedBlockNumber
          if (isSyncPut) continue

          this.emit(DATA_PUT_EVENT, op.value)
        }
      })
    }

  /**
   * Getters
   */

  // @dev The value is guaranteed to exist because it is set in the init function
  async getLastBlockSynced(primaryKey: string): Promise<number> {
    try {
      const syncKey = this.#getLastBlockSyncedKey(primaryKey)
      const res = await this.get(syncKey) as SyncDBValue
      return res.syncedBlockNumber
    } catch (err) {
      throw new Error(`No last block synced found for primaryKey ${primaryKey}. error: ${err}`)
    }
  }

  async getIndexedItem(primaryKey: string, secondaryKeys: string[]): Promise<DecodedLogWithContext> {
    let key = primaryKey
    if (secondaryKeys.length) {
      key += '!' + secondaryKeys.join('!')
    }

    // TODO: Possibly move get to base DB so this is DRYer
    try {
      return (await this.get(key)) as DecodedLogWithContext
    } catch (err) {
      throw new Error(`No item found for key ${key}. error: ${err}`)
    }
  }

  /**
   * Setters
   */

  async putItemIndexedItem(primaryKey: string, syncedBlockNumber: number, logs: DecodedLogWithContext[]): Promise<void> {
    const batch = this.batch()

    for (const log of logs) {
      // The index grows with each primaryKey, joined by '!'
      let indexedKey = primaryKey
      for (const secondaryKey of this.#secondaryKeys[primaryKey]) {
        // This abstract class knows the secondaryKey exists but does not care what it is, so we cast it
        const indexValue = log.decoded[secondaryKey as keyof typeof log.decoded]
        indexedKey += indexedKey ? '!' + indexValue : indexValue 
        batch.put(indexedKey, log)
      }
    }

    // Update the last block synced
    const syncKey = this.#getLastBlockSyncedKey(primaryKey)
    batch.put(syncKey, { syncedBlockNumber })

    return batch.write()
  }

  /**
   * Internal
   */

  #getLastBlockSyncedKey = (filterId: string): string => {
    return 'sync' + filterId
  }
}
