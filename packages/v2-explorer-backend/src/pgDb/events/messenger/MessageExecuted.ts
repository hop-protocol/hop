import { BaseType, EventDb } from '../BaseType.js'
import { getItemsWithContext, selectEventContextSql, eventContextIdCreationSql, getInsertEventContextSqlData } from '../context.js'
import { v4 as uuid } from 'uuid'

export interface MessageExecuted extends BaseType {
  messageId: string
  fromChainId: string
}

export class MessageExecutedTable extends EventDb {
  override async createTable () {
    await this.db.query(`CREATE TABLE IF NOT EXISTS message_executed_events (
        id TEXT PRIMARY KEY,
        message_id VARCHAR NOT NULL UNIQUE,
        from_chain_id VARCHAR NOT NULL,
        ${eventContextIdCreationSql}
    )`)
  }

  override async createIndexes () {
    await this.db.query(
      'CREATE UNIQUE INDEX IF NOT EXISTS idx_message_executed_events_message_id ON message_executed_events (message_id);'
    )
  }

  override async getItems (opts: any = {}) {
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
        from_chain_id AS "fromChainId"
      FROM
        message_executed_events e
      JOIN
        event_context ec ON e.event_context_id = ec.id
      WHERE
        ec.block_timestamp >= $1
        AND
        ec.block_timestamp <= $2
        ${filter?.messageId ? 'AND message_id = $5' : ''}
        ${filter?.transactionHash ? 'AND ec.transaction_hash = $5' : ''}
      ORDER BY
        ec.block_timestamp
      DESC
      LIMIT $3
      OFFSET $4`,
      args)

    return getItemsWithContext(items)
  }

  override async upsertItem (item: any) {
    const { messageId, fromChainId, context } = item
    const {
      contextId,
      insertEventContextArgs,
      insertEventContextSql
    } = getInsertEventContextSqlData(context)
    const args = {
      id: uuid(), contextId, messageId, fromChainId
    }
    const sql = `
      INSERT INTO
        message_executed_events
      (id, event_context_id, message_id, from_chain_id)
      VALUES ${'(${id}, ${contextId}, ${messageId}, ${fromChainId)'}
      ON CONFLICT (message_id)
      ${'DO UPDATE SET message_id = ${messageId}'}
    `

    await this.db.tx(async (t: any) => {
      await t.none(insertEventContextSql, insertEventContextArgs)
      await t.none(sql, args)
    })
  }
}
