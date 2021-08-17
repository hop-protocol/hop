export default class MemoryStore {
  items: any = {}
  async updateItem (key: string, value: any):Promise<void> {
    this.items[key] = Object.assign({}, this.items[key], value)
  }

  async getItem (key: string):Promise<any> {
    return this.items[key]
  }

  async getItems ():Promise<any[]> {
    return Object.values(this.items)
  }

  async deleteItem (key: string):Promise<void> {
    delete this.items[key]
  }
}
