import BaseDb from './BaseDb'
import { OneWeekMs } from 'src/constants'

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

  async getItemsWithWeek (): Promise<State[]> {
    const items = await this.getItems()
    const oneWeekAgo = Math.floor((Date.now() - OneWeekMs) / 1000)
    return items.filter((item: State) => {
      return item.timestamp > oneWeekAgo
    })
  }
}

export default SyncStateDb
