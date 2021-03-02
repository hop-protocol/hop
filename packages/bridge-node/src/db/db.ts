const levelup = require('levelup')
const leveldown = require('leveldown')
const db = levelup(leveldown('src/db/db_data'))

class Db {
  async setItem (key: string, value: string) {
    return db.put(key, value)
  }

  async getItem (key: string) {
    const result = await db.get(key)
    if (result) {
      return result.toString()
    }
  }
}

export default new Db()
