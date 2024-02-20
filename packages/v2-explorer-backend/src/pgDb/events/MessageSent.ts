import { BaseType } from './BaseType'
import { contextSqlCreation, contextSqlInsert, contextSqlSelect, getItemsWithContext, getOrderedInsertContextArgs } from './context'
import { v4 as uuid } from 'uuid'

export interface MessageSent extends BaseType {
  messageId: string
  from: string
  toChainId: number
  to: string
  data: string
}

export class MessageSent {
  db: any

  constructor (db: any) {
    this.db = db
  }

  async createTable () {
    await this.db.query(`CREATE TABLE IF NOT EXISTS message_sent_events (
        id TEXT PRIMARY KEY,
        message_id VARCHAR NOT NULL UNIQUE,
        "from" VARCHAR NOT NULL,
        to_chain_id VARCHAR NOT NULL,
        "to" VARCHAR NOT NULL,
        "data" VARCHAR NOT NULL,
        ${contextSqlCreation}
    )`)
  }

  async createIndexes () {
    await this.db.query(
      'CREATE UNIQUE INDEX IF NOT EXISTS idx_message_sent_events_message_id ON message_sent_events (message_id);'
    )
  }

  async getItems (opts: any = {}) {
    const { startTimestamp = 0, endTimestamp = Math.floor(Date.now() / 1000), limit = 10, page = 1, filter } = opts
    let offset = (page - 1) * limit
    if (offset < 0) {
      offset = 0
    }
    const args = [startTimestamp, endTimestamp, limit, offset]
    if (filter?.messageId) {
      args.push(filter.messageId)
    } else if (filter?.transactionHash) {
      args.push(filter.transactionHash)
    }
    const items = await this.db.any(
      `SELECT
        message_id AS "messageId",
        "from",
        to_chain_id AS "toChainId",
        "to",
        "data",
        ${contextSqlSelect}
      FROM
        message_sent_events
      WHERE
        _block_timestamp >= $1
        AND
        _block_timestamp <= $2
        ${filter?.messageId ? 'AND message_id = $5' : ''}
        ${filter?.transactionHash ? 'AND _transaction_hash = $5' : ''}
      ORDER BY
        _block_timestamp
      DESC
      LIMIT $3
      OFFSET $4`,
      args)

    return getItemsWithContext(items)
  }

  async upsertItem (item: any) {
    const { messageId, from, toChainId, to, data, context } = item
    const args = [
      uuid(), messageId, from, toChainId, to, data,
      ...getOrderedInsertContextArgs(context)
    ]

    await this.db.query(
      `INSERT INTO
        message_sent_events
      (
        id,
        message_id,
        "from",
        to_chain_id,
        "to",
        "data",
        ${contextSqlInsert}
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
      ON CONFLICT (message_id)
      DO UPDATE SET _block_timestamp = $12, _transaction_hash = $8`, args
    )
  }
}
