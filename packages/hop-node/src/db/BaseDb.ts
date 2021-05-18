// @ts-ignore
import level from 'level'
import os from 'os'
import path from 'path'
import mkdirp from 'mkdirp'
import sub from 'subleveldown'
import { db as dbConfig } from 'src/config'
import Logger from 'src/logger'

const dbMap: { [key: string]: any } = {}

class BaseDb {
  public db: any
  public prefix: string
  public IDS = 'ids'
  logger = new Logger('config')

  constructor (prefix: string) {
    this.prefix = prefix
    const pathname = path.resolve(dbConfig.path.replace('~', os.homedir()))
    mkdirp.sync(pathname.replace(path.basename(pathname), ''))
    if (!dbMap[pathname]) {
      this.logger.info(`db path: ${pathname}`)
      dbMap[pathname] = level(pathname)
    }

    let key = `${pathname}:${prefix}`
    if (!dbMap[key]) {
      dbMap[key] = sub(dbMap[pathname], prefix, { valueEncoding: 'json' })
    }
    this.db = dbMap[key]
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

  public async update (key: string, data: any, dataCb: boolean = true) {
    const entry = await this.getById(key, {})
    const value = Object.assign({}, entry, data)
    if (dataCb) {
      await this.handleDataEvent(undefined, { key, value })
    }
    return this.db.put(key, value)
  }

  protected async getById (id: string, defaultValue: any = null) {
    try {
      return await this.db.get(id)
    } catch (err) {
      return defaultValue
    }
  }

  protected async getKeys (): Promise<string[]> {
    return Object.values(await this.getById(this.IDS, []))
  }
}

export default BaseDb
