import DatabaseMigrator from './DatabaseMigrator.js'
import { Logger } from '@hop-protocol/hop-node-core/logger'
// @ts-expect-error level-party does not have a types file as of 20231227
import level from 'level-party'
import os from 'node:os'
import path from 'node:path'
import sub from 'subleveldown'
import { EventEmitter } from 'node:events'
import { Migration } from './migrations.js'
import { config as globalConfig } from '#config/index.js'
import _ from 'lodash'
import { mkdirp } from 'mkdirp'
import { normalizeDbValue } from './utils.js'
const dbMap: { [key: string]: any } = {}

export enum DbOperations {
  Put = 'put',
  Get = 'get',
  GetMany = 'getMany',
  Del = 'del',
  Batch = 'batch',
  Upsert = 'upsert',
  InsertIfNotExists = 'insertIfNotExists'
}

export type DbBatchOperation = {
  type: DbOperations
  key: string
  value?: any
}

export type Item<T> = {
  [key: string]: T
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

type LogOptions = {
  key?: string
  value?: any
  logMsg?: string
  batchOperations?: DbBatchOperation[]
}

export type DbGetItemsFilters<T> = {
  dateFilterWithKeyPrefix?: DateFilterWithKeyPrefix
  cbFilterGet?: (key: string, value: T) => T | null
}

export type DbPutItemsFilters<T> = {
  dateFilterWithKeyPrefix?: DateFilterWithKeyPrefix
  cbFilterPut: (key: string, value: T) => Promise<void>
}

// Optional cbFilterPut when handling general
export type DbItemsFilters<T> = (DbGetItemsFilters<T> & DbPutItemsFilters<T>) & {
  cbFilterPut?: DbPutItemsFilters<T>['cbFilterPut']
}
export type DbMigrationFilters<T> = DbPutItemsFilters<T>

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
  public logger: Logger
  private ready = false
  private isMigrating = false
  private readonly dbWriteBufferSize = 8 * 1024 * 1024 // 8 MB
  private readonly metadataKey: string = '_metadata'
  abstract update (key: string, value: T): Promise<void>

  constructor (prefix: string, _namespace?: string, migrations?: Migration[]) {
    super()
    if (!prefix) {
      throw new Error('db prefix is required')
    }
    if (_namespace) {
      prefix = `${_namespace}:${prefix}`
    }
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
        writeBufferSize: this.dbWriteBufferSize
      })
    }

    const key = `${pathname}:${prefix}`
    if (!dbMap[key]) {
      dbMap[key] = sub(dbMap[pathname], prefix, { valueEncoding: 'json' })
    }
    this.db = dbMap[key]

    this.db
      .on('error', (err: Error) => {
        this.logger.error(`leveldb error: ${err.message}`)
        process.exit(1)
      })

    if (migrations) {
      this.#init(migrations)
        .then(() => {
          this.isMigrating = false
          this.ready = true
          this.logger.info('migrations complete. db ready.')
        })
        .catch(err => {
          this.logger.error('db migration error', err)
          this.logger.error(err)
          process.exit(1)
        })

    } else {
      this.ready = true
      this.logger.info('db ready')
    }
  }

  async #init (migrations: Migration[]): Promise<void> {
    const databaseMigrator = new DatabaseMigrator<T>({
      db: this,
      migrations
    })
    const metadata = await this.#getMetadata()
    const migrationIndex = metadata?._migrationIndex ?? 0
    this.isMigrating = true
    databaseMigrator.migrate(migrationIndex)
      .then(async (updatedMigrationIndex: number) => {
        await this.#upsertMetadata({
          _migrationIndex: updatedMigrationIndex
        })
      })
      .catch(err => {
        throw err
      })
  }

  isReady (): boolean {
    return this.ready
  }

  /**
   * API Wrapper
   */

  protected async put (key: string, value: T): Promise<void> {
    this.#logDbOperation(DbOperations.Put, { key, value })
    return this.db.put(key, value)
  }

  protected async get (key: string): Promise<T| null> {
    try {
      const value = await this.db.get(key)
      return this.#normalizeValue(value)
    } catch (err) {
      return null
    }
  }

  protected async getMany (keys: string[]): Promise<T[]> {
    try {
      const values = await this.db.getMany(keys)
      return values.filter(this.#normalizeValue)
    } catch (err) {
      return []
    }
  }

  protected async del (key: string): Promise<void> {
    // if the key does not exist, this operation will still succeed
    this.#logDbOperation(DbOperations.Del, { key })
    return this.db.del(key)
  }

  protected async batch (batchOperations: DbBatchOperation[]): Promise<void> {
    this.#logDbOperation(DbOperations.Batch, { batchOperations })
    return this.db.batch(batchOperations)
  }

  /**
   * Custom DB Operations - Individual items
   */

  protected async upsert (key: string, value: T): Promise<void> {
    const dbValue = await this.get(key) ?? {} as T
    if (_.isEqual(dbValue, value)) {
      const logMsg = 'New value is the same as existing value. Skipping write.'
      this.#logDbOperation(DbOperations.Upsert, { key, value, logMsg })
      return
    }
    const updatedValue = this.getUpdatedValue(dbValue, value)
    return this.put(key, updatedValue)
  }

  protected async insertIfNotExists (key: string, value: T): Promise<void> {
    const exists = await this.exists(key)
    if (exists) {
      const logMsg = 'Key and value already exist. Skipping write.'
      this.#logDbOperation(DbOperations.InsertIfNotExists, { key, value, logMsg })
      return
    }
    await this.put(key, value)
  }

  protected async exists (key: string): Promise<boolean> {
    return !!(await this.get(key))
  }

  /**
   * Custom DB Operations - All items
   */

  protected async upsertAll (filters: DbPutItemsFilters<T>): Promise<void> {
    await this.#processItems(filters)
  }

  protected async getKeys (filters?: DbGetItemsFilters<T>): Promise<string[]> {
    const items: Array<Item<T>> = await this.#processItems(filters as DbItemsFilters<T>)
    return items.map(item => Object.keys(item)[0])
  }

  protected async getValues (filters?: DbGetItemsFilters<T>): Promise<T[]> {
    const items: Array<Item<T>> = await this.#processItems(filters as DbItemsFilters<T>)
    return items.map(item => Object.values(item)[0])
  }

  async #processItems (filters?: DbItemsFilters<T>): Promise<Array<Item<T>>> {
    if (filters?.cbFilterPut && filters?.cbFilterGet) {
      throw new Error('cbFilterPut and cbFilterGet cannot be used together')
    }

    let dbKeyFilter: DbKeyFilter = {}
    if (filters?.dateFilterWithKeyPrefix) {
      dbKeyFilter = this.#getDateFilter(filters.dateFilterWithKeyPrefix)
    }

    // Iterate over each item. If a callback exists, execute. Otherwise, return the value.
    const items: Array<Item<T>> = []
    try {
      for await (let [key, value] of this.db.iterator(dbKeyFilter)) {
        // the parameter types depend on what key/value enabled options were used
        if (typeof key === 'object') {
          value = key.value
          key = key.key
        }

        // ignore metadata keys and legacy keys that are no longer used
        const legacyKeys = this.#getLegacyKeys()
        if (
          key === this.metadataKey ||
          legacyKeys.includes(key)
        ) {
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

        filteredValue = this.#normalizeValue(filteredValue)
        items.push({
          [key]: filteredValue
        })
      }
    } catch (err) {
      throw new Error(`Error processing items: ${err.message}`)
    }

    return items.filter(this.filterExisty)
  }

  /**
   * Metadata and migrations
   * @remarks Metadata is stored in a separate namespace and doesn't use generics so we need
   * to use a separate method to access it.
   */

  async #upsertMetadata (value: Partial<DbMetadata>): Promise<void> {
    const dbValue = await this.get(this.metadataKey) ?? {} as DbMetadata
    const updatedValue = Object.assign({}, dbValue, value)
    return this.db.put(this.metadataKey, updatedValue)
  }

  async #getMetadata (): Promise<DbMetadata | null> {
    let value: DbMetadata | null = null
    try {
      value = await this.db.get(this.metadataKey)
    } catch {}
    return value
  }

  async upsertMigrationValues (filter: DbMigrationFilters<T>): Promise<void> {
    // This is the only DB operation that is not protected. It is used to perform migrations
    // and then is blocked after the migration is complete.
    if (this.ready) {
      throw new Error('Can only run migrations before the db is ready')
    }
    await this.upsertAll(filter as DbPutItemsFilters<T>)
  }

  /**
   * Utils
   */

  async getAllItems (): Promise<Array<Item<T>>> {
    this.logger.warn('getAllItems is memory intensive. Consider using a filter.')
    const allItemsCb = (key: string, value: T): T => {
      return value
    }
    const filter: DbGetItemsFilters<T> = {
      cbFilterGet: allItemsCb
    }
    return this.#processItems(filter as DbItemsFilters<T>)
  }

  async getNumItems (): Promise<number> {
    this.logger.warn('getNumItems is memory intensive. Consider using a filter.')
    let count = 0
    const countCb = (key: string, value: T): null => {
      count++
      return null
    }
    const filter: DbGetItemsFilters<T> = {
      cbFilterGet: countCb
    }
    await this.#processItems(filter as DbItemsFilters<T>)
    return count
  }

  getUpdatedValue (existingValue: T, newValue: T): T {
    return Object.assign({}, existingValue, newValue)
  }

  protected filterExisty = (x: any) => {
    return x
  }

  #normalizeValue = (value: T): T => {
    return normalizeDbValue(value)
  }

  #getDateFilter (dateFilterWithKeyPrefix: DateFilterWithKeyPrefix): DbKeyFilter {
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

  #logDbOperation (operation: string, logOptions: LogOptions): void {
    const { key, value, logMsg, batchOperations } = logOptions

    const logs: string[] = [`DB Operation: ${operation}`]

    // Warn the consumer that the DB is not yet ready
    if (!this.ready && !this.isMigrating) {
      logs.push('DB is not ready and this operation may cause unexpected results')
    }
    if (key) {
      logs.push(`key: ${key}`)
    }
    if (value) {
      logs.push(`value: ${JSON.stringify(value)}`)
    }
    if (logMsg) {
      logs.push(`${logMsg}`)
    }
    if (batchOperations) {
      const maxLength = 1000
      if (batchOperations.length > maxLength) {
        logs.push(`batchOperations (${batchOperations.length} items): ${JSON.stringify(batchOperations).substring(0, maxLength)}... (truncated ${batchOperations.length - maxLength} operations)`)
      } else {
        logs.push(`batchOperations (${batchOperations.length} items): ${JSON.stringify(batchOperations)}`)
      }
    }
    this.logger.dbOperation(logs.join(', '))
  }

  #getLegacyKeys (): string[] {
    // keys that were once used and still exist in some DBs but are no longer used
    return [
      'ids',
      '_dbMigrationIndex'
    ]
  }
}

export default BaseDb
