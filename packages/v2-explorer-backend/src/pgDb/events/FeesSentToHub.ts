import { BaseType } from './BaseType'
import { BigNumber } from 'ethers'
import { contextSqlCreation, getItemsWithContext, getOrderedInsertContextArgs } from './context'
import { v4 as uuid } from 'uuid'

export interface FeesSentToHub extends BaseType {
  amount: BigNumber
}

export class FeesSentToHub {
  db: any

  constructor (db: any) {
    this.db = db
  }

  async createTable () {
    await this.db.query(`CREATE TABLE IF NOT EXISTS fees_sent_to_hub_events (
        id TEXT PRIMARY KEY,
        amount NUMERIC NOT NULL,
        ${contextSqlCreation}
    )`)
  }

  async createIndexes () {

  }

  async getItems (opts: any = {}) {
    const { startTimestamp = 0, endTimestamp = Math.floor(Date.now() / 1000), limit = 10, page = 1 } = opts
    let offset = (page - 1) * limit
    if (offset < 0) {
      offset = 0
    }
    const items = await this.db.any(
      `SELECT
        amount
      FROM
        fees_sent_to_hub_events
      WHERE
        _block_timestamp >= $1
        AND
        _block_timestamp <= $2
      ORDER BY
        _block_timestamp
      DESC
      LIMIT $3
      OFFSET $4`,
      [startTimestamp, endTimestamp, limit, offset])

    return getItemsWithContext(items)
  }

  async upsertItem (item: any) {
    const { amount, context } = this.normalizeDataForPut(item)
    const args = [
      uuid(), amount,
      ...getOrderedInsertContextArgs(context)
    ]
    await this.db.query(
      `INSERT INTO
        bundle_set_events
      (id, amount)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      ON CONFLICT (tx_hash)
      DO UPDATE SET _block_timestamp = $9, _transaction_hash = $5`, args
    )
  }

  normalizeDataForGet (getData: Partial<FeesSentToHub>): Partial<FeesSentToHub> {
    if (!getData) {
      return getData
    }

    const data = Object.assign({}, getData)
    if (data.amount && typeof data.amount === 'string') {
      data.amount = BigNumber.from(data.amount)
    }

    return data
  }

  normalizeDataForPut (putData: Partial<FeesSentToHub>): Partial<FeesSentToHub> {
    const data = Object.assign({}, putData) as any
    if (data.amount && typeof data.amount !== 'string') {
      data.amount = data.amount.toString()
    }

    return data
  }
}
