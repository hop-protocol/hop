import BaseDb from './BaseDb'

export type State = {
  key: string
  latestBlockSynced: number
  timestamp: number
}

// structure:
// key: `<chainId>:<address>:<eventName>`
// value: `{ ...State }`
class SyncStateDb extends BaseDb {
  async update (key: string, data: Partial<State>) {
    if (!data.key) {
      data.key = key
    }
    await this._update(key, data)
    const entry = await this.getById(key)
    this.logger.debug(`updated db syncState item. ${JSON.stringify(entry)}`)
  }

  normalizeValue (key: string, value: State) {
    if (value) {
      value.key = key
    }
    return value
  }

  async getByKey (key: string): Promise<State> {
    const item: State = await this.getById(key)
    return this.normalizeValue(key, item)
  }

  async getItems (): Promise<State[]> {
    const items: State[] = await this.getValues()
    return items.filter(x => x)
  }
}

export default SyncStateDb
