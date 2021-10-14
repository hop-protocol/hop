import BaseDb from './BaseDb'

export interface State {
  key: string
}

class GasBoostDb extends BaseDb {
  async update (key: string, data: Partial<State>) {
    return await this._update(key, data)
  }

  async getItem (key: string): Promise<State | undefined> {
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
      keys.map(async (key: string) => {
        return await this.getItem(key)
      })
    )
    const isDefined = (item: State | undefined): item is State => {
      return item !== undefined
    }
    return items.filter(isDefined)
  }

  async deleteItem (key: string): Promise<void> {
    await this.deleteById(key)
  }
}

export default GasBoostDb
