import BaseDb, { DbMigrationFilters } from './BaseDb'
import { Migration } from './migrations'

type DatabaseMigratorParams<T> = {
  db: BaseDb<T>
  migrations: Migration[]
}

class DatabaseMigrator<T> {
  private readonly db: BaseDb<T>
  private readonly migrations: Migration[]

  constructor (params: DatabaseMigratorParams<T>) {
    this.db = params.db
    this.migrations = params.migrations
  }

  // Migrations are memory intensive. Ensure there is no unintentional memory overflow.
  // This may take minutes to complete.
  async migrate (migrationIndex: number): Promise<number> {
    if (!this.migrations?.length) {
      this.db.logger.debug('no migrations to process')
      return migrationIndex
    }

    const numMigrations = this.migrations.length
    if (migrationIndex >= numMigrations) {
      this.db.logger.debug(`no migration required, migrationIndex: ${migrationIndex}`)
      return migrationIndex
    }

    this.db.logger.debug(`processing migrations from ${migrationIndex} to ${numMigrations}`)
    let updatedMigrationIndex = migrationIndex
    for (let i = migrationIndex; i < numMigrations; i++) {
      const migration: Migration = this.migrations[i]
      this.db.logger.debug(`processing migration ${i}`)
      await this.processMigration(migration)
      updatedMigrationIndex++
      this.db.logger.debug(`completed migration ${i}`)
    }
    this.db.logger.debug('migrations complete')
    return updatedMigrationIndex
  }

  protected async processMigration (migration: Migration): Promise<void> {
    const migrationCb = async (key: string, value: T): Promise<void> => {
      const {
        migrationProperty,
        expectedPropertyValue,
        migratedPropertyValue
      } = migration

      const existingPropertyValue = this.getPropertyValue(value as { [key: string]: any }, migrationProperty)
      if (
        existingPropertyValue !== undefined &&
        existingPropertyValue === expectedPropertyValue
      ) {
        return
      }

      const updatedValue: T = this.db.getUpdatedValue(value, migratedPropertyValue)
      return this.db.update(key, updatedValue)
    }

    const filters: DbMigrationFilters<T> = {
      cbFilterPut: migrationCb
    }
    await this.db.upsertMigrationValues(filters)
  }

  // Get a property from a generic object, if it exists
  protected getPropertyValue<T extends { [key: string]: any }>(obj: T, property: string): any | undefined {
    return obj?.[property]
  }
}

export default DatabaseMigrator
