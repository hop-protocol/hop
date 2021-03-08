import level from 'level'
import sub from 'subleveldown'
import TransfersDb from './TransfersDb'

export const db = level('src/db/db_data')

class BaseDb {
  public db: any
  prefix: string

  constructor (prefix: string) {
    this.prefix = prefix
    this.db = sub(db, prefix, { valueEncoding: 'json' })
  }

  handleDataEvent = async (err, data) => {
    if (err) {
      throw err
    }
    if (!data) {
      return
    }
    const { key, value } = data
    if (key === 'ids') {
      return
    }
    const list = await this.getKeys()
    const unique = new Set(list.concat(key))
    return this.update('ids', Array.from(unique), false)
  }

  async update (key: string, data: any, dataCb: boolean = true) {
    const entry = await this.getById(key, {})
    const value = Object.assign({}, entry, data)
    if (dataCb) {
      await this.handleDataEvent(undefined, { key, value })
    }
    return this.db.put(key, value)
  }

  async getById (id: string, defaultValue: any = null) {
    try {
      return await this.db.get(id)
    } catch (err) {
      return defaultValue
    }
  }

  async getKeys (): Promise<string[]> {
    return Object.values(await this.getById('ids', []))
  }
}

export default BaseDb
