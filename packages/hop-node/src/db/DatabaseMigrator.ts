import BaseDb, { DbItemsFilter } from './BaseDb'
import { Migration } from './migrations'

class DatabaseMigrator<T> {
  private readonly db: BaseDb<T>

  constructor (db: BaseDb<T>) {
    this.db = db
  }

  // Migrations are memory intensive. Ensure there is no unintentional memory overflow.
  // This may take minutes to complete.
  async migrate (migrations: Migration[], migrationIndex: number): Promise<number> {
    if (!migrations?.length) {
      this.db.logger.debug('no migrations to process')
      return migrationIndex
    }

    const lastMigrationIndex = migrations.length - 1
    if (migrationIndex > lastMigrationIndex) {
      this.db.logger.debug(`no migration required, migrationIndex: ${migrationIndex}`)
      return migrationIndex
    }

    this.db.logger.debug(`processing migrations from ${migrationIndex} to ${lastMigrationIndex}`)
    let updatedMigrationIndex = migrationIndex
    for (let i = migrationIndex; i <= lastMigrationIndex; i++) {
      const migration: Migration = migrations[i]
      this.db.logger.debug(`processing migration ${i}`)
      await this.#processMigration(migration)
      updatedMigrationIndex++
      this.db.logger.debug(`completed migration ${i}`)
    }
    this.db.logger.debug('migrations complete')
    return migrationIndex
  }

  async #processMigration (migration: Migration): Promise<void> {
    const migrateCb = async (key: string, value: T): Promise<void> => {
      const {
        key: migrationKey,
        value: migrationValue,
        migratedValue
      } = migration
      const existingValue = this.#getProperty(migrationKey, value as { [key: string]: any })
      if (
        existingValue !== undefined &&
        existingValue !== migrationValue
      ) {
        return
      }

      const updatedValue: T = this.db.getUpdatedValue(value, migratedValue)
      return this.db.update(key, updatedValue)
    }

    const filters: DbItemsFilter<T> = {
      cbFilterPut: migrateCb
    }
    await this.db.upsertMigrationValues(filters)
    this.db.logger.debug(`DB migration complete`)
  }

  // Get a property from a generic object, if it exists
  #getProperty<T extends { [key: string]: any }>(key: string, value: T): any | undefined {
    return value?.[key]
  }
}

export default DatabaseMigrator
