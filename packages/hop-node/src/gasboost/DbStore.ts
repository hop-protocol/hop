import { Db, getDbSet } from 'src/db'

export default class DbStore {
  items: any = {}
  db: Db

  constructor () {
    this.db = getDbSet('gasBoost')
  }

  async updateItem (key: string, value: any):Promise<void> {
    await this.db.gasBoost.update(key, value)
  }

  async getItem (key: string):Promise<any> {
    return this.db.gasBoost.getItem(key)
  }

  async getItems ():Promise<any[]> {
    return this.db.gasBoost.getItems()
  }

  async deleteItem (key: string):Promise<void> {
    return this.db.gasBoost.deleteItem()
  }
}
