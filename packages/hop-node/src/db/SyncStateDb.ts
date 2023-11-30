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
    await this.put(key, value)
  }

  async getByKey (key: string): Promise<State | null> {
    const value: State | null = await this.get(key)
    if (!value) {
      return null
    }
    return value 
  }
}

export default SyncStateDb
