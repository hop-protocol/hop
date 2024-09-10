import { DB } from './DB.js'
import { utils } from 'ethers'
import type { IRelayerDB } from './interfaces/IRelayerDB.js'

/**
 * The key can be any string as long as it is unique to the DB.
 */

type DBKey = string
type DBValue<RelayItem> = {
  item: RelayItem
  relayedAt: number
  retries: number
}

export class RelayerDB<RelayItem> extends DB<DBKey, DBValue<RelayItem>> implements IRelayerDB<RelayItem> {
  readonly #maxRetries: number = 10

  constructor (dbName: string) {
    super(dbName + 'RelayerDB')
  }

  /**
   * Setters
   */

  async addItem (relayItem: RelayItem): Promise<void> {
    if (await this.#doesItemExist(relayItem)) {
      throw new Error('Item already exists')
    }
    return this.#updateItem(relayItem, 0, 0)
  }

  async removeItem (relayItem: RelayItem): Promise<void> {
    if (!(await this.#doesItemExist(relayItem))) {
      throw new Error('Item does not exist')
    }
    const key = this.#getKey(relayItem)
    return this.del(key)
  }

  async setRelayTime (relayItem: RelayItem): Promise<void> {
    const key = this.#getKey(relayItem)
    const item = await this.get(key)
    return this.#updateItem(relayItem, Date.now(), item.retries)
  }

  async incrementRetryCount (relayItem: RelayItem): Promise<void> {
    const key = this.#getKey(relayItem)
    const item = await this.get(key)
    return this.#updateItem(relayItem, item.relayedAt, item.retries + 1)
  }

  /**
   * Getters
   */

  async *getRelayableItems (): AsyncGenerator<RelayItem> {
    for await (const [, dbValue] of this.iterator()) {
      const now = Date.now()
      if (now > dbValue.expiresAtMs) continue

      yield dbValue.item
    }
  }

  /**
   * Internal
   */

  async #updateItem (relayItem: RelayItem, expiresAtMs: number): Promise<void> {
    const key = this.#getKey(relayItem)
    this.logger.debug(`Adding item with key: ${key}`)
    return this.put(key, {
      item: relayItem,
      expiresAtMs,
      retries
    })
  }

  async #doesItemExist (relayItem: RelayItem): Promise<boolean> {
    const key = this.#getKey(relayItem)
    const dbValue: DBValue<RelayItem> | null = await this.getIfExists(key)
    if (!dbValue) return false

    const now = Date.now()
    if (now > dbValue.expiresAtMs) {
      this.logger.debug(`Item expired: ${key}`)
      return false
    }

    return true
  }

  #getKey (item: RelayItem): string {
    const stringifiedItem = JSON.stringify(item)
    return utils.keccak256(utils.toUtf8Bytes(stringifiedItem))
  }
}
