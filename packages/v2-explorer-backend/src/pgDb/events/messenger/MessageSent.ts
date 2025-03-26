import { BaseType, EventDb } from '../BaseType.js'
import { getItemsWithContext, selectEventContextSql, eventContextIdCreationSql, getInsertEventContextSqlData } from '../context.js'
import { v4 as uuid } from 'uuid'

export interface MessageSent extends BaseType {
  messageId: string
  from: string
  toChainId: string
  to: string
  data: string
}

export class MessageSentTable extends EventDb {
  override async createTable () {
    await this.db.query(`CREATE TABLE IF NOT EXISTS message_sent_events (
        id TEXT PRIMARY KEY,
        message_id CHAR(66) NOT NULL UNIQUE, -- bytes32 hash
        "from" CHAR(42) NOT NULL, -- Ethereum address
        to_chain_id NUMERIC(78, 0) NOT NULL CHECK (to_chain_id >= 0), -- uint256
        "to" CHAR(42) NOT NULL, -- Ethereum address
        "data" TEXT NOT NULL,
        ${eventContextIdCreationSql}
    )`)
  }

  override async createIndexes () {
    await this.db.query(
      'CREATE UNIQUE INDEX IF NOT EXISTS idx_message_sent_events_message_id ON message_sent_events (message_id);'
    )
    await this.db.query(
      'CREATE INDEX IF NOT EXISTS idx_message_sent_events_from ON message_sent_events ("from");'
    )
    await this.db.query(
      'CREATE INDEX IF NOT EXISTS idx_message_sent_events_to ON message_sent_events ("to");'
    )
    await this.db.query(
      'CREATE INDEX IF NOT EXISTS idx_message_sent_events_to_chain_id ON message_sent_events (to_chain_id);'
    )
    await this.db.query(
      'CREATE INDEX IF NOT EXISTS idx_message_sent_events_event_context_id ON message_sent_events (event_context_id);'
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
    } else if (filter?.toChainId) {
      args.push(filter.toChainId)
    } else if (filter?.eventChainId) {
      args.push(filter.eventChainId)
    }

    const items = await this.db.any(
      `SELECT
        message_id AS "messageId",
        "from",
        to_chain_id AS "toChainId",
        "to",
        e."data",
        ${selectEventContextSql}
      FROM
        message_sent_events e
      JOIN
        event_context ec ON e.event_context_id = ec.id
      WHERE
        ec.block_timestamp >= $1
        AND
        ec.block_timestamp <= $2
        ${filter?.messageId ? 'AND message_id = $5' : ''}
        ${filter?.toChainId ? 'AND to_chain_id = $5' : ''}
        ${filter?.transactionHash ? 'AND ec.transaction_hash = $5' : ''}
        ${filter?.eventChainId ? 'AND ec.chain_id = $5' : ''}
      ORDER BY
        ec.block_timestamp
      DESC
      LIMIT $3
      OFFSET $4`,
      args)

    const itemsWithContext = getItemsWithContext(items)

    return itemsWithContext.map((item, index) => {
      return {
        ...item,
        i: (page - 1) * limit + index + 1
      }
    })
  }

  override async upsertItem (item: any) {
    const { messageId, from, toChainId, to, data, context } = item
    const {
      contextId,
      insertEventContextArgs,
      insertEventContextSql
    } = getInsertEventContextSqlData(context)
    const args = {
      id: uuid(), contextId, messageId, from, toChainId, to, data
    }

    const sql = `
      INSERT INTO
        message_sent_events
      (
        id,
        event_context_id,
        message_id,
        "from",
        to_chain_id,
        "to",
        "data"
      )
      VALUES ${'(${id}, ${contextId}, ${messageId}, ${from}, ${toChainId}, ${to}, ${data})'}
      ON CONFLICT (message_id)
      ${'DO UPDATE SET message_id = ${messageId}, "from" = ${from}, to_chain_id = ${toChainId}, "to" = ${to}, "data" = ${data}'}
    `

    await this.db.tx(async (t: any) => {
      await t.none(insertEventContextSql, insertEventContextArgs)
      await t.none(sql, args)
    })
  }
}
