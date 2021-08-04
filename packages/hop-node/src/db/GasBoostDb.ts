import BaseDb from './BaseDb'

export type State = {
  key: string
}

class GasBoostDb extends BaseDb {
  async update (key: string, data: Partial<State>) {
    return super.update(key, data)
  }

  async getItem (key: string): Promise<State> {
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
        return this.getItem(key)
      })
    )
    return items.filter(x => x)
  }

  async deleteItem (key: string):Promise<void> {
    await this.deleteById(key)
  }
}

export default GasBoostDb
