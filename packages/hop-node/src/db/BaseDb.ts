// @ts-ignore
import level from 'level'
import sub from 'subleveldown'
import path from 'path'

const dbpath = path.resolve(__dirname, '../../db_data')
export const db = level(dbpath)

class BaseDb {
  public db: any
  public prefix: string
  public IDS = 'ids'

  constructor (prefix: string) {
    this.prefix = prefix
    this.db = sub(db, prefix, { valueEncoding: 'json' })
  }

  handleDataEvent = async (err: Error, data: any) => {
    if (err) {
      throw err
    }
    if (!data) {
      return
    }
    const { key } = data
    if (key === this.IDS) {
      return
    }
    const list = await this.getKeys()
    const unique = new Set(list.concat(key))
    return this.update(this.IDS, Array.from(unique), false)
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
    return Object.values(await this.getById(this.IDS, []))
  }
}

export default BaseDb
