import Logger from 'src/logger'
import groupBy from 'lodash/groupBy'
import level from 'level'
import merge from 'lodash/merge'
import mkdirp from 'mkdirp'
import os from 'os'
import path from 'path'
import spread from 'lodash/spread'
import sub from 'subleveldown'
import wait from 'src/utils/wait'
import { EventEmitter } from 'events'
import { Mutex } from 'async-mutex'
import { TenSecondsMs } from 'src/constants'
import { config as globalConfig } from 'src/config'

const dbMap: { [key: string]: any } = {}

enum Event {
  Error = 'error',
  Batch = 'batch',
}

export type BaseItem = {
  _id?: string
  _createdAt?: number
}

export type KV = {
  key: string
  value: any
}

type QueueItem = {
  key: string
  value: any
  cb: any
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

class BaseDb extends EventEmitter {
  ready = false
  public db: any
  public prefix: string
  logger: Logger
  mutex: Mutex = new Mutex()
  pollIntervalMs: number = 5 * 1000
  lastBatchUpdatedAt: number = Date.now()
  batchSize: number = 10
  batchTimeLimit: number = 3 * 1000
  batchQueue: QueueItem[] = []

  constructor (prefix: string, _namespace?: string) {
    super()
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

    const logPut = (key: string, value: any) => {
      // only log recently created items
      const recentlyCreated = value?._createdAt && Date.now() - value._createdAt < TenSecondsMs
      if (recentlyCreated) {
        this.logger.debug(`put item, key=${key}`)
      }
    }

    this.db
      .on('open', () => {
        this.logger.debug('open')
      })
      .on('closed', () => {
        this.logger.debug('closed')
      })
      .on('batch', (ops: any[]) => {
        this.emit(Event.Batch, ops)
        for (const op of ops) {
          if (op.type === 'put') {
            logPut(op.key, op.value)
          }
        }
      })
      .on('put', (key: string, value: any) => {
        logPut(key, value)
      })
      .on('clear', (key: string) => {
        this.logger.debug(`clear item, key=${key}`)
      })
      .on('error', (err: Error) => {
        this._emitError(err)
        this.logger.error(`leveldb error: ${err.message}`)
      })

    this.pollBatchQueue()
    this.migration()
      .then(() => {
        this.ready = true
        this.logger.debug('ready')
      })
      .catch(err => {
        this.logger.error(err)
        process.exit(1)
      })
  }

  async migration () {
    // Optional migration,
    // Implement in child class
  }

  protected async tilReady (): Promise<boolean> {
    if (this.ready) {
      return true
    }

    await wait(100)
    return await this.tilReady()
  }

  async pollBatchQueue () {
    await this.tilReady()
    while (true) {
      try {
        await this.checkBatchQueue()
      } catch (err) {
        this.logger.error('pollBatchQueue error:', err)
      }
      await wait(this.pollIntervalMs)
    }
  }

  async addUpdateKvToBatchQueue (key: string, value: any, cb: any) {
    this.logger.debug(`adding to batch, key: ${key} `)
    this.batchQueue.push({ key, value, cb })
    await this.checkBatchQueue()
  }

  async checkBatchQueue () {
    const timestampOk = this.lastBatchUpdatedAt + this.batchTimeLimit < Date.now()
    const batchSizeOk = this.batchQueue.length >= this.batchSize
    const shouldPutBatch = (timestampOk || batchSizeOk) && this.batchQueue.length
    if (shouldPutBatch) {
      const ops = this.batchQueue.slice(0)
      this.batchQueue = []
      this.lastBatchUpdatedAt = Date.now()
      this.logger.debug(`attempting batch write, items: ${ops?.length} `)
      await this.putBatch(ops)
    }
  }

  protected async _getUpdateData (key: string, data: any) {
    const entry = await this.getById(key, {
      _createdAt: Date.now()
    })
    const value = Object.assign({}, entry, data)
    return { key, value }
  }

  async _update (key: string, data: any) {
    return this._updateWithBatch(key, data)
  }

  async _updateSingle (key: string, data: any) {
    return this.mutex.runExclusive(async () => {
      const { value } = await this._getUpdateData(key, data)
      return this.db.put(key, value)
    })
  }

  async _updateWithBatch (key: string, data: any) {
    const logger = this.logger.create({ id: key })
    return new Promise(async (resolve, reject) => {
      const cb = (err: Error, ops: any[]) => {
        if (err) {
          reject(err)
          return
        }
        logger.debug(`received batch put event. items: ${ops?.length}`)
        resolve(null)
      }
      await this.addUpdateKvToBatchQueue(key, data, cb)
    })
  }

  public async putBatch (putItems: QueueItem[]) {
    return this.mutex.runExclusive(async () => {
      const ops: any[] = []
      for (const data of putItems) {
        const { key, value } = await this._getUpdateData(data.key, data.value)
        ops.push({
          type: 'put',
          key,
          value
        })
      }

      // merge all properties belong to same key
      const groups = groupBy(ops, 'key')
      const keys = Object.keys(groups)
      const groupedOps = Object.values(groups).map((items: any[], i) => {
        const value = spread(merge)(items.map(this.getValue))
        return {
          type: 'put',
          key: keys[i],
          value
        }
      })

      return new Promise((resolve, reject) => {
        this.db.batch(groupedOps, (err: Error) => {
          for (const { cb } of putItems) {
            if (cb) {
              cb(err, putItems)
            }
          }

          if (err) {
            this._emitError(err)
            reject(err)
            return
          }

          resolve(null)
        })
      })
    })
  }

  async getById (id: string, defaultValue: any = null) {
    try {
      const value = await this.db.get(id)
      return this.normalizeReadValue(id, value)
    } catch (err) {
      if (!err.message.includes('Key not found in database')) {
        this.logger.error(`getById error: ${err.message}`)
      }
      return defaultValue
    }
  }

  attachId (id: string, item: any) {
    if (item) {
      item._id = id
    }
    return item
  }

  normalizeReadValue (key: string, value: any) {
    return this.attachId(key, value)
  }

  async batchGetByIds (ids: string[], defaultValue: any = null) {
    const values = []
    for (const id of ids) {
      values.push(await this.getById(id))
    }
    return values.filter(this.filterExisty)
  }

  async deleteById (id: string) {
    return this.db.del(id)
  }

  private getKey (x: any): string {
    return x.key
  }

  private getValue (x: any): any {
    return x.value
  }

  async getKeys (filter?: KeyFilter): Promise<string[]> {
    filter = Object.assign({
      keys: true,
      values: false
    }, filter)
    const kv = await this.getKeyValues(filter)
    return kv.map(this.getKey).filter(this.filterExisty)
  }

  async getValues (filter?: KeyFilter): Promise<any[]> {
    filter = Object.assign({
      keys: true,
      values: true
    }, filter)
    const kv = await this.getKeyValues(filter)
    return kv.map(this.getValue).filter(this.filterExisty)
  }

  async getKeyValues (filter: KeyFilter = { keys: true, values: true }): Promise<KV[]> {
    return await new Promise((resolve, reject) => {
      const kv: KV[] = []
      const s = this.db.createReadStream(filter)
      s.on('data', (key: any, value: any) => {
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
          kv.push({ key, value: Object.assign({}, value) })
        }
      })
        .on('end', () => {
          s.destroy()
          resolve(kv)
        })
        .on('error', (err: any) => {
          s.destroy()
          reject(err)
        })
    })
  }

  filterExisty = (x: any) => {
    return x
  }

  // explainer: https://stackoverflow.com/q/35185749/1439168
  private _emitError (err: Error) {
    if (this.listeners(Event.Error).length > 0) {
      this.emit(Event.Error, err)
    }
  }
}

export default BaseDb
