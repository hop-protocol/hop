import Logger from 'src/logger'
import level from 'level'
import mkdirp from 'mkdirp'
import os from 'os'
import path from 'path'
import queue from 'src/decorators/queue'
import sub from 'subleveldown'
import { boundClass } from 'autobind-decorator'
import { config as globalConfig } from 'src/config'

const dbMap: { [key: string]: any } = {}

@boundClass
class BaseDb {
  public db: any
  public prefix: string
  public IDS = 'ids'
  public idMap: { [key: string]: boolean }
  logger = new Logger('config')

  getQueueGroup () {
    return this.prefix
  }

  constructor (prefix: string, _namespace?: string) {
    if (!prefix) {
      throw new Error('db prefix is required')
    }
    if (_namespace) {
      prefix = `${_namespace}:${prefix}`
    }
    this.prefix = prefix
    const pathname = path.resolve(globalConfig.db.path.replace('~', os.homedir()))
    mkdirp.sync(pathname.replace(path.basename(pathname), ''))
    if (!dbMap[pathname]) {
      this.logger.info(`db path: ${pathname}`)
      dbMap[pathname] = level(pathname)
    }

    const key = `${pathname}:${prefix}`
    if (!dbMap[key]) {
      dbMap[key] = sub(dbMap[pathname], prefix, { valueEncoding: 'json' })
    }
    this.db = dbMap[key]
  }

  @queue
  public async update (key: string, data: any) {
    const entry = await this.getById(key, {})
    const value = Object.assign({}, entry, data)

    // lazy load id map
    if (!this.idMap) {
      this.idMap = await this.getIdMap()
    }

    // track unique keys
    this.idMap[key] = true

    // store id map
    await this.db.put(this.IDS, this.idMap)

    // store entry
    return this.db.put(key, value)
  }

  protected async getById (id: string, defaultValue: any = null) {
    try {
      return await this.db.get(id)
    } catch (err) {
      return defaultValue
    }
  }

  protected async deleteById (id: string) {
    return this.db.delete(id)
  }

  protected async getIdMap (): Promise<{ [key: string]: boolean }> {
    return this.getById(this.IDS, {})
  }

  protected async getKeys (): Promise<string[]> {
    const obj = await this.getIdMap()
    return Object.keys(obj)
  }
}

export default BaseDb
