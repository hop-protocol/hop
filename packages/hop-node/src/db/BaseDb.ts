import Logger from 'src/logger'
import level from 'level-party'
import mkdirp from 'mkdirp'
import os from 'os'
import path from 'path'
import sub from 'subleveldown'
import wait from 'src/utils/wait'
import { EventEmitter } from 'events'
import { Migration } from 'src/db/migrations'
import { config as globalConfig } from 'src/config'
import { normalizeDbItem } from './utils'
import DatabaseMigrator from './DatabaseMigrator'

const dbMap: { [key: string]: any } = {}

enum Event {
  Error = 'error'
}

export type KV<T> = {
  key: string
  value: T
}

type DbMetadata = {
  _createdAt?: number
  _migrationIndex?: number
}

export type DateFilter = {
  fromUnix?: number
  toUnix?: number
}

export type DateFilterWithKeyPrefix = DateFilter & {
  keyPrefix: string
}

export type CbFilterGet<T> = (key: string, value: T) => T | null
export type CbFilterPut<T> = (key: string, value: T) => Promise<void>
export type DbItemsFilter<T> = {
  dateFilterWithKeyPrefix?: DateFilterWithKeyPrefix
  cbFilterGet?: CbFilterGet<T>
  cbFilterPut?: CbFilterPut<T>
}

// These are LevelDB options
export type DbKeyFilter = {
  gt?: string
  gte?: string
  lt?: string
  lte?: string
  limit?: number
  reverse?: boolean
  keys?: boolean
  values?: boolean
}

abstract class BaseDb<T> extends EventEmitter {
  public db: any
  public prefix: string
  public logger: Logger
  private ready = false
  private readonly metadataKey: string = '_metadata'

  constructor (prefix: string, _namespace?: string, migrations?: Migration[]) {
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
      // Default write buffer size is 4 MB. Increase to 8 MB for more efficient disk writes.
      dbMap[pathname] = level(pathname, {
        writeBufferSize: 8 * 1024 * 1024 // 8 MB
      })
    }

    const key = `${pathname}:${prefix}`
    if (!dbMap[key]) {
      dbMap[key] = sub(dbMap[pathname], prefix, { valueEncoding: 'json' })
    }
    this.db = dbMap[key]

    this.db
      .on('error', (err: Error) => {
        this.#emitError(err)
        this.logger.error(`leveldb error: ${err.message}`)
      })


    if (migrations) {
      this.#init(migrations)
    } else {
      this.ready = true
      this.logger.debug('db ready')
    }
  }

  async #init(migrations: Migration[]): Promise<void> {
    const databaseMigrator = new DatabaseMigrator<T>(this)
    const metadata = await this.#getMetadata()
    const migrationIndex = metadata?._migrationIndex ?? 0
    databaseMigrator.migrate(migrations, migrationIndex)
      .then(async (updatedMigrationIndex: number) => {
        await this.#upsertMetadata({
          _migrationIndex: updatedMigrationIndex
        })
        this.ready = true
        this.logger.debug('db ready')
      })
      .catch(err => {
        this.logger.error(err)
        process.exit(1)
      })
  }

  protected async tilReady (): Promise<boolean> {
    if (this.ready) {
      return true
    }

    await wait(100)
    return await this.tilReady()
  }

  async update(key: string, value: T): Promise<void> {
    throw new Error('update method not implemented')
  }

  /**
   * API Wrapper
   */

  protected async _put (key: string, value: T): Promise<void> {
    return this.db.put(key, value)
  }

  protected async _get (key: string): Promise<T| null> {
    try {
      const item = await this.db.get(key)
      return item
    } catch (err) {
      return null
    }
  }

  protected async _getMany (keys: string[]): Promise<T[]> {
    try {
      const items = await this.db.getMany(keys)
      return items
    } catch (err) {
      return []
    }
  }

  protected async _del (id: string): Promise<void> {
    return this.db.del(id)
  }

  /**
   * Custom DB Operations - Individual items
   */

  protected async _upsert (key: string, value: T): Promise<void> {
    let entry = await this._get(key) ?? {} as T
    const updatedValue = this.getUpdatedValue(entry, value)
    return this._put(key, updatedValue)
  }

  protected async _insertIfNotExists(key: string, value: T): Promise<void> {
    const exists = await this._exists(key)
    if (exists) {
      return
    }
    await this._put(key, value)
  }

  protected async _exists (key: string): Promise<boolean> {
    return !!(await this._get(key))
  }

  /**
   * Custom DB Operations - All items
   */

  protected async _upsertAll (filters?: DbItemsFilter<T>): Promise<void> {
    if (filters?.cbFilterGet) {
      throw new Error('cbFilterGet cannot be used with _upsertAll')
    }
    if (!filters?.cbFilterPut) {
      throw new Error('cbFilterPut is required with _upsertAll')
    }
    await this.#_processItems(filters)
  }

  protected async _getKeys (filters?: DbItemsFilter<T>): Promise<string[]> {
    if (filters?.cbFilterPut) {
      throw new Error('cbFilterPut cannot be used with _getKeys')
    }
    const items: KV<T>[] = await this.#_processItems(filters)
    return items.map(item => item.key)
  }

  protected async _getValues (filters?: DbItemsFilter<T>): Promise<T[]> {
    if (filters?.cbFilterPut) {
      throw new Error('cbFilterPut cannot be used with _getValues')
    }
    const items: KV<T>[] = await this.#_processItems(filters)
    return items.map(item => item.value)
  }

  async #_processItems(filters?: DbItemsFilter<T>): Promise<KV<T>[]> {
    if (filters?.cbFilterPut && filters?.cbFilterGet) {
      throw new Error('cbFilterPut and cbFilterGet cannot be used together')
    }

    let dbKeyFilter: DbKeyFilter = {}
    if (filters?.dateFilterWithKeyPrefix) {
      dbKeyFilter = this.#_getDateFilter(filters.dateFilterWithKeyPrefix)
    }

    // Iterate over each item. If a callback exists, execute. Otherwise, return the value.
    const items: KV<T>[] = []
    try {
      for await (let [key, value] of this.db.iterate(dbKeyFilter)) {
        // the parameter types depend on what key/value enabled options were used
        if (typeof key === 'object') {
          value = key.value
          key = key.key
        }
        // ignore this key that used previously to track unique ids
        if (key === 'ids') {
          continue
        }

        // Handle put filter, if exists
        if (filters?.cbFilterPut) {
          await filters.cbFilterPut(key, value)
          continue
        }

        // Handle get filter, if exists
        let filteredValue: T | null
        if (filters?.cbFilterGet) {
          filteredValue = filters.cbFilterGet(key, value)
        } else {
          filteredValue = value
        }

        if (!filteredValue) {
          continue
        }

        items.push({
          key,
          value: filteredValue
        })

      }
    } catch {}

    return items.filter(this._filterExisty)
  }

  /**
   * Metadata and migrations
   * @remarks Metadata is stored in a separate namespace and doesn't use generics so we need
   * to use a separate method to access it.
   */

  async #upsertMetadata(value: Partial<DbMetadata>): Promise<void> {
    const entry = await this._get(this.metadataKey) ?? {} as DbMetadata
    const updatedValue = Object.assign({}, entry, value)
    return this.db.put(this.metadataKey, updatedValue)
  }

  async #getMetadata(): Promise<DbMetadata | null> {
    try {
      const item = await this.db.get(this.metadataKey)
      return item
    } catch (err) {
      return null
    }
  }

  async upsertMigrationValues (filters: DbItemsFilter<T>): Promise<void> {
    // This is the only DB operation that is not protected. It is used to perform migrations
    // and then is blocked after the migration is complete.
    if (this.ready) {
      throw new Error('Can only run migrations before the db is ready')
    }
    await this._upsertAll(filters)
  }

  /**
   * Utils
   */

  #_getDateFilter (dateFilterWithKeyPrefix: DateFilterWithKeyPrefix): DbKeyFilter {
    const { keyPrefix, fromUnix, toUnix } = dateFilterWithKeyPrefix
    const filter: DbKeyFilter = {
      gte: `${keyPrefix}:`,
      lte: `${keyPrefix}:~`
    }

    if (fromUnix) {
      filter.gte = `${keyPrefix}:${fromUnix}`
    }
    if (toUnix) {
      filter.lte = `${keyPrefix}:${toUnix}~` // tilde is intentional
    }
    return filter
  }

  protected _filterExisty = (x: any) => {
    return x
  }

  protected _normalizeItem (item: T): T {
    return normalizeDbItem(item)
  }

  getUpdatedValue (existingValue: T, newValue: T): T {
    return Object.assign({}, existingValue, newValue)
  }

  // explainer: https://stackoverflow.com/q/35185749/1439168
  #emitError (err: Error) {
    if (this.listeners(Event.Error).length > 0) {
      this.emit(Event.Error, err)
    }
  }
}

export default BaseDb
