import fs from 'fs'
import level from 'level'
import sub from 'subleveldown'
import { Mutex } from 'async-mutex'

// this are options that leveldb createReadStream accepts
export type KeyValueFilter = {
  gt?: string
  gte?: string
  lt?: string
  lte?: string
  limit?: number
  reverse?: boolean
  keys?: boolean
  values?: boolean
}

export type KV = {
  key: string
  value: any
}

const cache: Record<string, any> = {}

export class BaseDb {
  db: any
  mutex: Mutex = new Mutex()
  dbPath: string
  dbName: string

  constructor (dbPath: string, dbName: string) {
    if (!dbPath) {
      throw new Error('dbPath is required')
    }
    if (!fs.existsSync(dbPath)) {
      fs.mkdirSync(dbPath, { recursive: true })
    }
    this.dbPath = dbPath
    this.dbName = dbName
    // console.log('dbPath:', dbPath)
    const eventsDb = cache[dbPath] || level(dbPath)
    if (!cache[dbPath]) {
      cache[dbPath] = eventsDb
    }
    // console.log('dbName:', dbName)
    const subDb = cache[dbName] || sub(eventsDb, dbName, { valueEncoding: 'json' })
    if (!cache[dbName]) {
      cache[dbName] = subDb
    }
    this.db = subDb
    this.db
      .on('open', () => {
        // console.debug('open')
      })
      .on('closed', () => {
        console.debug('closed')
      })
      .on('batch', (ops: any[]) => {
        for (const op of ops) {
          if (op.type === 'put') {
            console.log('put', op.key, op.value)
          }
        }
      })
      .on('put', (key: string, value: any) => {
        console.log('put', key, value)
      })
      .on('clear', (key: string) => {
        console.debug(`clear item, key=${key}`)
      })
      .on('error', (err: Error) => {
        console.error(`leveldb error: ${err.message}`)
      })
  }

  async _put (key: string, value: any): Promise<boolean> {
    return this.mutex.runExclusive(async () => {
      await this.db.put(key, value)
      return true
    })
  }

  async _update (key: string, value: any): Promise<boolean> {
    const oldValue = await this._get(key)
    const newValue = Object.assign({}, oldValue ?? {}, value)
    await this._put(key, newValue)
    return true
  }

  async _get (key: string): Promise<any | null> {
    let value: any = null
    try {
      value = await this.db.get(key)
    } catch (err) {
      if (!err.message.includes('Key not found in database')) {
        throw err
      }
    }

    return value ?? null
  }

  async _delete (key: string): Promise<boolean> {
    return this.mutex.runExclusive(async () => {
      await this.db.del(key)
      return true
    })
  }

  async _getKeyValues (filter: KeyValueFilter = { keys: true, values: true }): Promise<KV[]> {
    return await new Promise((resolve, reject) => {
      const kv: KV[] = []
      const s = this.db.createReadStream(filter)
      s.on('data', (key: any, value: any) => {
        // the parameter types depend on what key/value enabled options were used
        if (typeof key === 'object') {
          value = key.value
          key = key.key
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
}
