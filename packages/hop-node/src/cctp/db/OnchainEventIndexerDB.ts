import { DB } from './DB.js'
import type { DecodedLogWithContext } from '../types.js'
import { DATA_PUT_EVENT } from './constants.js'
import { normalizeDBValue } from './utils.js'

/**
 * The primary key is the filterId and the secondary keys are the values that
 * are indexed by the consumer.
 * 
 * The DB stores and maintains the last block synced for each filterId.
 * 
 * Key Format:
 * - syncBlock: sync!filterId
 * - indexer: filterId, (filterId!indexedValue1, filterId!indexedValue1!indexedValue2, ...)
 * 
 * @dev This DB should only be used to get individual items. There should never be a
 * need to iterate over all items in the DB. This is because the indexing is
 * done such that each entry is guaranteed to be unique.
 */

type IndexDBValue = DecodedLogWithContext
type SyncDBValue = {
  syncedBlockNumber: number
}
type DBValue = IndexDBValue | SyncDBValue

export class OnchainEventIndexerDB extends DB<string, DBValue> {
  readonly #secondaryKeys: Record<string, string[]> = {}
  readonly #syncPrefix = 'sync'

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

  async initializeIndexer (primaryKey: string, chainId: string, startBlockNumber: number): Promise<void> {
    const syncKey = this.#getLastBlockSyncedKey(primaryKey)
    if (await this.has(syncKey)) {
      return
    }

    await this.put(syncKey, { 
      syncedBlockNumber: startBlockNumber
    })
  }

  init (): void {
    this.#initListeners()
    this.logger.info('Onchain Event DB initialized')
  }

  /**
   * Node events
   */

    #initListeners = (): void => {
      // https://github.com/Level/levelup?tab=readme-ov-file#events
      this.on('batch', (operations: any[]) => {
        for (const op of operations) {
          // Only emit put events
          if (op.type !== 'put') continue

          // Only emit the event if the value is not a sync value
          if (op.key.substring(0, 4) === this.#syncPrefix) continue

          // Multiple writes of the same data occur if there are multiple indexes
          // for the item. We only want to emit the event once per item, not
          // per index, so we ignore a key if it is part of a subDB.
          if (op.key.includes('!')) continue

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

    try {
      const item = await this.get(key) as IndexDBValue
      return normalizeDBValue(item) as DecodedLogWithContext
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
      batch.put(primaryKey, log)

      let indexedKey = primaryKey
      for (const secondaryKey of this.#secondaryKeys[primaryKey]) {
        // This abstract class knows the secondaryKey exists but does not care what it is, so we cast it
        const indexValue = String(log.decoded[secondaryKey as keyof typeof log.decoded])
        indexedKey += indexedKey ? ('!' + indexValue) : indexValue 
        batch.put(indexedKey, log)
      }
    }

    // Update the last block synced
    const syncKey = this.#getLastBlockSyncedKey(primaryKey)
    batch.put(syncKey, { syncedBlockNumber })

    let message = `Writing syncedBlockNumber ${syncedBlockNumber} for primaryKey ${primaryKey}`
    if (logs.length) {
      message += ` on chainId ${logs[0].context.chainId} with ${logs.length} logs. ${JSON.stringify(logs)}`
    }
    return batch.write()
  }

  /**
   * Internal
   */

  #getLastBlockSyncedKey = (filterId: string): string => {
    return `${this.#syncPrefix}!${filterId}`
  }
}
