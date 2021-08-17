import BaseDb from './BaseDb'

export type State = {
  key: string
  latestBlockSynced: number
  timestamp: number
}

class SyncStateDb extends BaseDb {
  async update (key: string, data: Partial<State>) {
    return super.update(key, data)
  }

  async getByKey (key: string): Promise<State> {
    const item = await this.getById(key)
    if (!item) {
      return
    }
    item.key = key
    return item
  }

  async getItems (): Promise<State[]> {
    const keys = await this.getKeys()
    const items = await Promise.all(
      keys.map((key: string) => {
        return this.getByKey(key)
      })
    )
    return items.filter(x => x)
  }
}

export default SyncStateDb
