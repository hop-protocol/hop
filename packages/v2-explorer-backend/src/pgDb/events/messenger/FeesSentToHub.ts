import { BaseType, EventDb } from '../BaseType.js'
import { BigNumber } from 'ethers'
import { getItemsWithContext, selectEventContextSql, eventContextIdCreationSql, getInsertEventContextSqlData } from '../context.js'
import { v4 as uuid } from 'uuid'

export interface FeesSentToHub extends BaseType {
  amount: BigNumber
}

export class FeesSentToHubTable extends EventDb {
  override async createTable () {
    await this.db.query(`CREATE TABLE IF NOT EXISTS fees_sent_to_hub_events (
        id TEXT PRIMARY KEY,
        amount NUMERIC NOT NULL CHECK (amount >= 0),
        ${eventContextIdCreationSql}
    )`)
  }

  override async createIndexes () {}

  override async getItems (opts: any = {}) {
    const { startTimestamp = 0, endTimestamp = Math.floor(Date.now() / 1000), limit = 10, page = 1 } = opts
    let offset = (page - 1) * limit
    if (offset < 0) {
      offset = 0
    }
    const items = await this.db.any(
      `SELECT
        amount,
        ${selectEventContextSql}
      FROM
        fees_sent_to_hub_events e
      JOIN
        event_context ec ON e.event_context_id = ec.id
      WHERE
        ec.block_timestamp >= $1
        AND
        ec.block_timestamp <= $2
      ORDER BY
        ec.block_timestamp
      DESC
      LIMIT $3
      OFFSET $4`,
      [startTimestamp, endTimestamp, limit, offset])

    return getItemsWithContext(items).map(item => this.#normalizeDataForGet(item))
  }

  override async upsertItem (item: any) {
    const { amount, context } = this.#normalizeDataForPut(item)
    const {
      contextId,
      insertEventContextArgs,
      insertEventContextSql
    } = getInsertEventContextSqlData(context)
    const args = {
      id: uuid(), contextId, amount,
    }
    const sql = `
      INSERT INTO
        fees_sent_to_hub_events
      (id, event_context_id, amount)
      VALUES ${'(${id}, ${contextId}, ${amount})'}
      ON CONFLICT (id)
      ${'DO UPDATE SET amount = ${amount}, event_context_id = ${contextId}'}
    `

    await this.db.tx(async (t: any) => {
      await t.none(insertEventContextSql, insertEventContextArgs)
      await t.none(sql, args)
    })
  }

  #normalizeDataForGet (getData: Partial<FeesSentToHub>): Partial<FeesSentToHub> {
    if (!getData) {
      return getData
    }

    const data = Object.assign({}, getData)
    if (data.amount && typeof data.amount === 'string') {
      data.amount = BigNumber.from(data.amount)
    }

    return data
  }

  #normalizeDataForPut (putData: Partial<FeesSentToHub>): Partial<FeesSentToHub> {
    const data = Object.assign({}, putData) as any
    if (data.amount && typeof data.amount !== 'string') {
      data.amount = data.amount.toString()
    }

    return data
  }
}
