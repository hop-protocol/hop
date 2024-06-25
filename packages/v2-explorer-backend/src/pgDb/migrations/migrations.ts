import { BaseDb } from '../events/BaseType.js'

export interface Migration {
  id: string
  name: string
  run_on: Date
}

export class MigrationTable extends BaseDb {
  override async createTable () {
    await this.db.query(`CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      run_on TIMESTAMPTZ NOT NULL DEFAULT now()
    )`)
  }

  override async createIndexes () {
    await this.db.query(
      'CREATE UNIQUE INDEX IF NOT EXISTS idx_migrations_name ON migrations (name);'
    )
  }

  override async getItems (opts: any = {}) {
    const items = await this.db.any(
      `SELECT
        id,
        name,
        run_on
      FROM
        migrations
      ORDER BY
        run_on
      DESC
      `,
      [])

    return items
  }

  override async upsertItem (item: any) {
    const { name } = item
    const args = {
      name
    }
    await this.db.query(
      `INSERT INTO
        migrations
      (
        name
      )
      VALUES ${'(${name})'}
      ON CONFLICT (name)
      ${'DO UPDATE SET name = ${name}'}`, args
    )
  }

  async deleteItem (item: any) {
    const { name } = item
    const args = {
      name
    }
    await this.db.query(
      `
      DELETE FROM
        migrations
      WHERE
      name = ${'(${name})'}
      `, args
    )
  }
}
