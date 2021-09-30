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

export type BaseItem = {
  _id?: string
  _createdAt?: number
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
        const recentlyCreated = value?._createdAt && Date.now() - value._createdAt < 1 * 1000
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
      return defaultValue
    }
  }

  protected async deleteById (id: string) {
    return this.db.del(id)
  }

  protected async getKeys (): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const keys : string[] = []
      this.db.createKeyStream()
        .on('data', (key: string) => {
          // ignore this key that used previously to track unique ids
          if (key === 'ids') {
            return
          }
          keys.push(key)
        })
        .on('end', () => {
          resolve(keys)
        })
        .on('error', (err: any) => {
          reject(err)
        })
    })
  }
}

export default BaseDb
