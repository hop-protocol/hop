import { readdirSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Example:
// sql/1_add_col_foo.up.sql # ALTER TABLE my_table ADD COLUMN foo VARCHAR;
// sql/1_add_col_foo.down.sql # ALTER TABLE my_table DROP COLUMN IF EXISTS foo;
const migrationsDir = join(__dirname, './sql')

export class MigrationManager {
  constructor(private migrationsTable: any) {}

  async getAppliedMigrations(): Promise<string[]> {
    const result = await this.migrationsTable.getItems()
    return result.map((row: { name: string }) => row.name)
  }

  async applyMigration(name: string, direction: 'up' | 'down'): Promise<void> {
    const filePath = join(migrationsDir, `${name}.${direction}.sql`)
    const sql = readFileSync(filePath, 'utf-8')
    await this.migrationsTable.db.none(sql)
    if (direction === 'up') {
      await this.migrationsTable.upsertItem({ name })
    } else {
      await this.migrationsTable.deleteItem({ name })
    }
  }

  async rollbackMigration(count?: number): Promise<void> {
    const appliedMigrations = await this.getAppliedMigrations()
    const migrationsToRollback = count ? appliedMigrations.slice(-count) : appliedMigrations

    for (const file of migrationsToRollback.reverse()) {
      console.log(`Reverting migration: ${file}`)
      await this.applyMigration(file, 'down')
      console.log(`Migration reverted: ${file}`)
    }
  }

  async runMigrations(rollbackCount = 0): Promise<void> {
    const appliedMigrations = await this.getAppliedMigrations()
    const migrationFiles = readdirSync(migrationsDir)
      .filter(file => file.endsWith('.up.sql'))
      .map(file => file.replace('.up.sql', ''))

    if (rollbackCount > 0) {
      await this.rollbackMigration(rollbackCount)
    }

    for (const file of migrationFiles) {
      if (!appliedMigrations.includes(file)) {
        console.log(`Applying migration: ${file}`)
        await this.applyMigration(file, 'up')
        console.log(`Migration applied: ${file}`)
      }
    }
  }
}
