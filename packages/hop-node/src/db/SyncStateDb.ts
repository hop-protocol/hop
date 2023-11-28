import BaseDb from './BaseDb'

export type State = {
  latestBlockSynced: number
  timestamp: number
}

// structure:
// key: `<chainId>:<address>:<eventName>`
// value: `{ ...State }`
class SyncStateDb extends BaseDb<State> {
  async update (key: string, value: State): Promise<void> {
    await this._put(key, value)
  }

  async getByKey (key: string): Promise<State | null> {
    const item: State | null = await this._get(key)
    if (!item) {
      return null
    }
    return item
  }
}

export default SyncStateDb
