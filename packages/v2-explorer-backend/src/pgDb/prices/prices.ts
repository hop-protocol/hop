import { EventDb } from '../events/BaseType.js'
import { v4 as uuid } from 'uuid'

export interface Price {
  token: string
  price_usd: string
  timestamp: number
}

export class PricesTable extends EventDb {
  override async createTable () {
    await this.db.query(`CREATE TABLE IF NOT EXISTS prices (
      id TEXT PRIMARY KEY,
      token VARCHAR NOT NULL,
      price_usd FLOAT8 NOT NULL,
      timestamp INTEGER NOT NULL
    )`)
  }

  override async createIndexes () {
    await this.db.query(
      'CREATE UNIQUE INDEX IF NOT EXISTS idx_prices_token_timestamp ON prices (token, timestamp);'
    )
  }

  override async getItems (opts: any = {}) {
    const { startTimestamp = 0, endTimestamp = Math.floor(Date.now() / 1000), limit = 10, page = 1, filter } = opts
    let offset = (page - 1) * limit
    if (offset < 0) {
      offset = 0
    }

    const args = [startTimestamp, endTimestamp, limit, offset]
    if (filter?.timestamp) {
      args.push(filter.timestamp)
    }

    const items = await this.db.any(
      `SELECT
        token,
        price_usd AS "priceUsd",
        timestamp
      FROM
        prices
      WHERE
        timestamp >= $1
        AND
        timestamp <= $2
        ${filter?.timestamp ? 'AND timestamp = $5' : ''}
      ORDER BY
        ec.block_timestamp
      DESC
      LIMIT $3
      OFFSET $4`,
      args)

    return items
  }

  override async upsertItem (item: any) {
    const { token, priceUsd, timestamp } = item
    const args = {
      id: uuid(), token, priceUsd, timestamp
    }
    const sql = `
      INSERT INTO
        prices
      (
        id, token, price_usd, timestamp
      )
      VALUES ${'(${id}, ${token}, ${priceUsd}, ${timestamp})'}
      ON CONFLICT (token, timestamp)
      ${'DO UPDATE SET price_usd = ${priceUsd}'}
    `

    await this.db.tx(async (t: any) => {
      await t.none(sql, args)
    })
  }

  async getClosestPrice (tokenSymbol: string, timestamp: number) {
    const args = [tokenSymbol, timestamp]
    const items = await this.db.any(
      `SELECT
        token,
        price_usd AS "priceUsd",
        timestamp
      FROM
        prices
      WHERE
        token = $1
      ORDER BY
        ABS(timestamp - $2)
      LIMIT 1`,
      args)

    return items[0] ?? null
  }
}
