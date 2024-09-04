import { DB } from './DB.js'
import { TimeIntervals } from '#constants/constants.js'
import { utils } from 'ethers'
import type { IRelayDB } from './interfaces/IRelayDB.js'

/**
 * The key can be any string as long as it is unique to the DB.
 *
 * The class supports TTL. TTL cannot be 0 for the sake of simplicity.
 */

type DBKey = string
type DBValue<RelayItem> = {
  item: RelayItem
  expireAtMs: number
}

export class RelayDB<RelayItem> extends DB<DBKey, DBValue<RelayItem>> implements IRelayDB<RelayItem> {
  // A tx that has not been relayed for an hour is considered expired in the context of this client.
  // This value can be changed to any value in milliseconds.
  #ttl: number = TimeIntervals.ONE_HOUR_MS

  constructor (dbName: string, ttl?: number) {
    super(dbName + 'RelayDB')

    if (typeof ttl !== 'undefined' && ttl <= 0) {
      throw new Error('TTL must be greater than 0')
    }

    this.#ttl = ttl ?? this.#ttl
  }

  /**
   * Setters
   */

  async addItem (relayItem: RelayItem): Promise<void> {
    const key = this.#getKey(relayItem)
    if (await this.#doesItemExist(key)) {
      throw new Error('Item already exists')
    }

    this.logger.debug(`Adding item with key: ${key}`)
    return this.put(key, {
      item: relayItem,
      expireAtMs: 0
    })
  }

  async removeItem (relayItem: RelayItem): Promise<void> {
    const key = this.#getKey(relayItem)
    if (await this.#doesItemExist(key)) {
      throw new Error('Item already exists')
    }
    return this.del(key)
  }

  async updateRelayTime (relayItem: RelayItem): Promise<void> {
    const key = this.#getKey(relayItem)
    const dbValue: DBValue<RelayItem> | null = await this.getIfExists(key)
    if (!dbValue) {
      throw new Error('Item does not exist')
    }

    this.logger.debug(`Updating item with key: ${key}`)
    const now = Date.now()
    return this.put(key, {
      item: dbValue.item,
      expireAtMs: now + this.#ttl
    })
  }

  /**
   * Getters
   */

  async *getRelayableItems (): AsyncGenerator<RelayItem> {
    for await (const [key, dbValue] of this.iterator()) {
      const now = Date.now()
      if (now > dbValue.expireAtMs) continue

      yield dbValue.item
    }
  }

  /**
   * Internal
   */

  async #doesItemExist (key: string): Promise<boolean> {
    const dbValue: DBValue<RelayItem> | null = await this.getIfExists(key)
    if (!dbValue) return false

    const now = Date.now()
    if (now > dbValue.expireAtMs) {
      this.logger.debug(`Item expired: ${key}`)
      return false
    }

    return true
  }

  #getKey = (item: RelayItem): string => {
    const stringifiedItem = JSON.stringify(item)
    return utils.keccak256(utils.toUtf8Bytes(stringifiedItem))
  }
}
