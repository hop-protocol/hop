import BaseDb from './BaseDb'

class GasBoostDb extends BaseDb {
  async updateItem (key: string, data: any): Promise<void> {
    await this._update(key, data)
  }

  async getItem (key: string): Promise<any> {
    const item = await this.getById(key)
    return item
  }

  async deleteItem (key: string): Promise<void> {
    await this.deleteById(key)
  }
}

export default GasBoostDb
