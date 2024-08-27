import { DB } from './DB.js'
import { TimeIntervals } from '#constants/constants.js'
import type { ITxRelayDB } from './interfaces/ITxRelayDB.js'

/**
 * The key can be any string as long as it is unique to the DB.
 *
 * The class supports TTL. TTL cannot be 0 for the sake of simplicity.
 */

type DBKey = string
type DBValue = {
  exists: boolean
  expireAtMs: number
}

export class TxRelayDB extends DB<DBKey, DBValue> implements ITxRelayDB {
  // A tx that has not been relayed for an hour is considered expired in the context of this client.
  // This value can be changed to any value in milliseconds.
  #ttl: number = TimeIntervals.ONE_HOUR_MS

  constructor (dbName: string, ttl?: number) {
    super(dbName + 'TxRelayDB')

    if (typeof ttl !== 'undefined' && ttl <= 0) {
      throw new Error('TTL must be greater than 0')
    }

    this.#ttl = ttl ?? this.#ttl
  }

  async addItem (item: string): Promise<void> {
    if (await this.doesItemExist(item)) {
      throw new Error('Item already exists')
    }
    this.logger.debug(`Adding item: ${item}`)
    const expireAtMs = Date.now() + this.#ttl
    return this.put(item, { exists: true, expireAtMs })
  }

  async removeItem (item: string): Promise<void> {
    if (await this.doesItemExist(item)) {
      throw new Error('Item already exists')
    }
    return this.del(item)
  }

  async doesItemExist (item: string): Promise<boolean> {
    const value: DBValue | null = await this.getIfExists(item)
    if (!value) return false

    const now = Date.now()
    if (now > value.expireAtMs) {
      this.logger.debug(`Item expired: ${item}`)
      return false
    }

    return true
  }
}
