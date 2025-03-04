import { DB } from '#db/DB.js'
import { utils } from 'ethers'

/**
 * The key can be any string as long as it is unique to the DB.
 */

type DBKey = string
type DBValue<RelayItem> = {
  item: RelayItem
  relayedAt: number
  retries: number
  inFlight: boolean
}

export class RelayerDB<RelayItem> extends DB<DBKey, DBValue<RelayItem>> {
  readonly #maxRetries: number = 10

  constructor (name: string) {
    super(name + 'RelayerDB')
  }

  async addItem (relayItem: RelayItem): Promise<void> {
    if (await this.#doesItemExist(relayItem)) {
      throw new Error('Item already exists')
    }
    return this.#updateItem(relayItem, 0, 0, false)
  }

  async removeItem (relayItem: RelayItem): Promise<void> {
    if (!(await this.#doesItemExist(relayItem))) {
      throw new Error('Item does not exist')
    }
    const key = this.#getKey(relayItem)
    return this.del(key)
  }

  async addRelayAttempt (relayItem: RelayItem): Promise<void> {
    const key = this.#getKey(relayItem)
    const item = await this.get(key)
    return this.#updateItem(relayItem, Date.now(), item.retries, true)
  }

  async handleRelayError (relayItem: RelayItem): Promise<void> {
    const key = this.#getKey(relayItem)
    const item = await this.get(key)

    if (item.retries >= this.#maxRetries) {
      throw new Error('Max retries reached')
    }

    return this.#updateItem(relayItem, item.relayedAt, item.retries + 1, false)
  }

  /**
   * Getters
   */

  async *getRelayableItems (): AsyncGenerator<RelayItem> {
    for await (const [, dbValue] of this.iterator()) {
      if (dbValue.inFlight) continue
      yield dbValue.item
    }
  }

  /**
   * Internal
   */

  async #updateItem (
    relayItem: RelayItem,
    relayedAt: number,
    retries: number,
    inFlight: boolean
  ): Promise<void> {
    const key = this.#getKey(relayItem)
    this.logger.debug(`Updating item with key: ${key}`)
    return this.put(key, {
      item: relayItem,
      relayedAt,
      retries,
      inFlight
    })
  }

  async #doesItemExist (relayItem: RelayItem): Promise<boolean> {
    const key = this.#getKey(relayItem)
    const dbValue: DBValue<RelayItem> | null = await this.getIfExists(key)
    if (!dbValue) return false

    return true
  }

  #getKey (item: RelayItem): string {
    const stringifiedItem = JSON.stringify(item)
    return utils.keccak256(utils.toUtf8Bytes(stringifiedItem))
  }
}
