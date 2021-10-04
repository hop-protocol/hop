import Logger from 'src/logger'
import level from 'level'
import mkdirp from 'mkdirp'
import os from 'os'
import path from 'path'
import queue from 'src/decorators/queue'
import sub from 'subleveldown'
import { TenSecondsMs } from 'src/constants'
import { boundClass } from 'autobind-decorator'
import { config as globalConfig } from 'src/config'

const dbMap: { [key: string]: any } = {}

export type BaseItem = {
  _id?: string
  _createdAt?: number
}

// this are options that leveldb createReadStream accepts
export type KeyFilter = {
  gt?: string
  gte?: string
  lt?: string
  lte?: string
  limit?: number
  reverse?: boolean
  keys?: boolean
  values?: boolean
}

@boundClass
class BaseDb {
  public db: any
  public prefix: string
  logger: Logger

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
    this.logger = new Logger({
      tag: 'Db',
      prefix
    })
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

    this.db
      .on('open', () => {
        this.logger.debug('open')
      })
      .on('closed', () => {
        this.logger.debug('closed')
      })
      .on('put', (key: string, value: any) => {
        // only log recently created items
        const recentlyCreated = value?._createdAt && Date.now() - value._createdAt < TenSecondsMs
        if (recentlyCreated) {
          this.logger.debug(`put item, key=${key}`)
        }
      })
      .on('clear', (key: string) => {
        this.logger.debug(`clear item, key=${key}`)
      })
  }

  @queue
  public async update (key: string, data: any) {
    const entry = await this.getById(key, {
      _createdAt: Date.now()
    })
    const value = Object.assign({}, entry, data)

    return this.db.put(key, value)
  }

  protected async getById (id: string, defaultValue: any = null) {
    try {
      const item = await this.db.get(id)
      if (item) {
        item._id = id
      }
      return item
    } catch (err) {
      if (!err.message.includes('Key not found in database')) {
        this.logger.error(`getById error: ${err.message}`)
      }
      return defaultValue
    }
  }

  protected async deleteById (id: string) {
    return this.db.del(id)
  }

  protected async getKeys (filter?: KeyFilter): Promise<string[]> {
    filter = Object.assign({
      keys: true,
      values: false
    }, filter)
    const kv = await this.getKeyValues(filter)
    return kv.map(x => x.key).filter(x => x)
  }

  protected async getKeyValues (filter: KeyFilter = { keys: true, values: true }): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const kv : any[] = []
      this.db.createReadStream(filter)
        .on('data', (key: any, value: any) => {
          // the parameter types depend on what key/value enabled options were used
          if (typeof key === 'object') {
            value = key.value
            key = key.key
          }
          // ignore this key that used previously to track unique ids
          if (key === 'ids') {
            return
          }
          if (typeof key === 'string') {
            kv.push({ key, value })
          }
        })
        .on('end', () => {
          resolve(kv)
        })
        .on('error', (err: any) => {
          reject(err)
        })
    })
  }
}

export default BaseDb
