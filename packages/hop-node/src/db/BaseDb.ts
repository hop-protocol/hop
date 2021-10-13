import Logger from 'src/logger'
import level from 'level'
import mkdirp from 'mkdirp'
import os from 'os'
import path from 'path'
import sub from 'subleveldown'
import wait from 'src/utils/wait'
import { EventEmitter } from 'events'
import { Mutex } from 'async-mutex'
import { TenSecondsMs } from 'src/constants'
import { config as globalConfig } from 'src/config'

const dbMap: { [key: string]: any } = {}

export enum Event {
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
  public db: any
  public prefix: string
  logger: Logger
  mutex: Mutex = new Mutex()
  pollIntervalMs : number = 5 * 1000
  lastBatchUpdatedAt : number = Date.now()
  batchSize : number = 5
  batchTimeLimit: number = 5 * 1000
  batchQueue : KV[] = []

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
  }

  async pollBatchQueue () {
    while (true) {
      await this.checkBatchQueue()
      await wait(this.pollIntervalMs)
    }
  }

  addUpdateKvToBatchQueue (key: string, value: any) {
    this.logger.debug(`adding to batch, key: ${key} `)
    this.batchQueue.push({ key, value })
  }

  async checkBatchQueue () {
    const timestampOk = this.lastBatchUpdatedAt + this.batchTimeLimit < Date.now()
    const batchSizeOk = this.batchQueue.length >= this.batchSize
    const shouldPutBatch = timestampOk || batchSizeOk
    if (shouldPutBatch) {
      const ops = this.batchQueue.slice(0)
      this.batchQueue = []
      this.lastBatchUpdatedAt = Date.now()
      this.logger.debug(`executing batch, items: ${ops?.length} `)
      await this.batchUpdate(ops)
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
    const logger = this.logger.create({ id: key })
    return this.mutex.runExclusive(async () => {
      return new Promise(async (resolve, reject) => {
        const errCb = (err: Error) => reject(err)
        const cb = (ops: any[]) => {
          this.off(Event.Error, errCb)
          logger.debug(`received batch put event. items: ${ops?.length}`)
          resolve(null)
        }
        this.once(Event.Error, errCb)
        this.once(Event.Batch, cb)
        this.addUpdateKvToBatchQueue(key, data)
        this.checkBatchQueue()
      })
    })
  }

  public async batchUpdate (putKvs: KV[]) {
    const ops : any[] = []
    for (const data of putKvs) {
      const { key, value } = await this._getUpdateData(data.key, data.value)
      ops.push({
        type: 'put',
        key,
        value
      })
    }

    return new Promise((resolve, reject) => {
      this.db.batch(ops, (err: Error) => {
        if (err) {
          this._emitError(err)
          reject(err)
          return
        }

        resolve(null)
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
    const values = await this.db.getMany(ids)
    const items: any[] = values.map((item: any, i: number) => {
      return this.normalizeReadValue(ids[i], item)
    })

    return items.filter(x => x)
  }

  protected async deleteById (id: string) {
    return this.db.del(id)
  }

  async getKeys (filter?: KeyFilter): Promise<string[]> {
    filter = Object.assign({
      keys: true,
      values: false
    }, filter)
    const kv = await this.getKeyValues(filter)
    return kv.map(x => x.key).filter(x => x)
  }

  async getValues (filter?: KeyFilter): Promise<any[]> {
    filter = Object.assign({
      keys: true,
      values: true
    }, filter)
    const kv = await this.getKeyValues(filter)
    return kv.map(x => x.value).filter(x => x)
  }

  async getKeyValues (filter: KeyFilter = { keys: true, values: true }): Promise<KV[]> {
    return new Promise((resolve, reject) => {
      const kv : KV[] = []
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
            value = this.normalizeReadValue(key, value)
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

  // explainer: https://stackoverflow.com/q/35185749/1439168
  private _emitError (err: Error) {
    if (this.listeners(Event.Error).length > 0) {
      this.emit(Event.Error, err)
    }
  }
}

export default BaseDb
