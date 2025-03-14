import { DB } from '#db/DB.js'
import { utils } from 'ethers'
import type { RelayTxContext } from './types.js'

/**
 * The key can be any string as long as it is unique to the DB.
 */

type DBKey = string
type DBValue<RelayTxMethodName, RelayItem> = {
  item: RelayItem
  relayTxContext: RelayTxContext<RelayTxMethodName>
  relayedAt: number
  retries: number
  inFlight: boolean
}

export class RelayerDB<RelayTxMethodName, RelayItem> extends DB<DBKey, DBValue<RelayTxMethodName, RelayItem>> {
  readonly #maxRetries: number = 10

  constructor (name: string) {
    super(name + 'RelayerDB')
  }

  async addItem (relayItem: RelayItem, relayTxContext: RelayTxContext<RelayTxMethodName>): Promise<void> {
    if (await this.#doesItemExist(relayItem)) {
      throw new Error('Item already exists')
    }
    return this.#updateItem(relayItem, relayTxContext, 0, 0, false)
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
    return this.#updateItem(relayItem, item.relayTxContext, Date.now(), item.retries, true)
  }

  async handleRelayError (relayItem: RelayItem): Promise<void> {
    const key = this.#getKey(relayItem)
    const item = await this.get(key)

    if (item.retries >= this.#maxRetries) {
      throw new Error('Max retries reached')
    }

    return this.#updateItem(relayItem, item.relayTxContext, item.relayedAt, item.retries + 1, false)
  }

  /**
   * Getters
   */

  async *getRelayableItems (): AsyncGenerator<[RelayItem, RelayTxContext<RelayTxMethodName>]> {
    for await (const [, dbValue] of this.iterator()) {
      if (dbValue.inFlight) continue
      yield [dbValue.item, dbValue.relayTxContext]
    }
  }

  async getTxContextByRelayItemKey(key: DBKey): Promise<RelayTxContext<RelayTxMethodName>> {
    const relayItem = await this.get(key)
    return relayItem.relayTxContext
  }

  /**
   * Internal
   */

  async #updateItem (
    relayItem: RelayItem,
    relayTxContext: RelayTxContext<RelayTxMethodName>,
    relayedAt: number,
    retries: number,
    inFlight: boolean
  ): Promise<void> {
    const key = this.#getKey(relayItem)
    this.logger.debug(`Updating item with key: ${key}`)
    return this.put(key, {
      item: relayItem,
      relayTxContext,
      relayedAt,
      retries,
      inFlight
    })
  }

  async #doesItemExist (relayItem: RelayItem): Promise<boolean> {
    const key = this.#getKey(relayItem)
    const dbValue: DBValue<RelayTxMethodName, RelayItem> | null = await this.getIfExists(key)
    if (!dbValue) return false

    return true
  }

  #getKey (item: RelayItem): string {
    const stringifiedItem = JSON.stringify(item)
    return utils.keccak256(utils.toUtf8Bytes(stringifiedItem))
  }
}
