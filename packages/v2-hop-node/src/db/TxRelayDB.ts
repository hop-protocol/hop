import { DB } from './DB.js'

/**
 * The key can be any string as long as it is unique to the DB.
 */

type DBKey = string
type DBValue = boolean

export class TxRelayDB extends DB<DBKey, DBValue> {

  constructor (dbName: string) {
    super(dbName + 'TxRelayDB')
  }

  async addItem (item: string): Promise<void> {
    if (await this.doesItemExist(item)) {
      throw new Error('Item already exists')
    }
    this.logger.debug(`Adding item: ${item}`)
    return this.put(item, true)
  }

  async removeItem (item: string): Promise<void> {
    if (await this.doesItemExist(item)) {
      throw new Error('Item already exists')
    }
    return this.put(item, false)
  }

  async doesItemExist (item: string): Promise<boolean> {
    return this.has(item)
  }
}
