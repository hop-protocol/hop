import { BaseType, EventDb } from '../BaseType.js'
import { getItemsWithContext, selectEventContextSql, eventContextIdCreationSql, getInsertEventContextSqlData } from '../context.js'
import { v4 as uuid } from 'uuid'

export interface MessageBundled extends BaseType {
  messageId: string
  bundleId: string
  treeIndex: number
}

export class MessageBundledTable extends EventDb {
  override async createTable () {
    await this.db.query(`CREATE TABLE IF NOT EXISTS message_bundled_events (
        id TEXT PRIMARY KEY,
        message_id VARCHAR NOT NULL UNIQUE,
        bundle_id VARCHAR NOT NULL,
        tree_index INTEGER NOT NULL,
        ${eventContextIdCreationSql}
    )`)
  }

  override async createIndexes () {
    await this.db.query(
      'CREATE UNIQUE INDEX IF NOT EXISTS idx_message_bundled_events_message_id_bundle_id ON message_bundled_events (message_id, bundle_id);'
    )
    await this.db.query(
      'CREATE UNIQUE INDEX IF NOT EXISTS idx_message_bundled_events_message_id ON message_bundled_events (message_id);'
    )
  }

  override async getItems (opts: any = {}) {
    const { startTimestamp = 0, endTimestamp = Math.floor(Date.now() / 1000), limit = 10, page = 1, filter } = opts
    let offset = (page - 1) * limit
    if (offset < 0) {
      offset = 0
    }
    const args = [startTimestamp, endTimestamp, limit, offset]
    if (filter?.bundleId) {
      args.push(filter.bundleId)
    } else if (filter?.messageId) {
      args.push(filter.messageId)
    } else if (filter?.transactionHash) {
      args.push(filter.transactionHash)
    }
    const items = await this.db.any(
      `SELECT
        message_id AS "messageId",
        bundle_id AS "bundleId",
        tree_index AS "treeIndex",
        ${selectEventContextSql}
      FROM
        message_bundled_events e
      JOIN
        event_context ec ON e.event_context_id = ec.id
      WHERE
        ec.block_timestamp >= $1
        AND
        ec.block_timestamp <= $2
        ${filter?.bundleId ? 'AND bundle_id = $5' : ''}
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
    const { messageId, bundleId, treeIndex, context } = item
    const {
      contextId,
      insertEventContextArgs,
      insertEventContextSql
    } = getInsertEventContextSqlData(context)
    const args = {
      id: uuid(), contextId, messageId, bundleId, treeIndex
    }
    const sql = `
      INSERT INTO
        message_bundled_events
      (
        id, event_context_id, message_id, bundle_id, tree_index
      )
      VALUES ${'(${id}, ${contextId}, ${messageId}, ${bundleId}, ${treeIndex})'}
      ON CONFLICT (message_id)
      ${'DO UPDATE SET message_id = ${messageId}'}
    `

    await this.db.tx(async (t: any) => {
      console.log('here0000', contextId)
      await t.none(insertEventContextSql, insertEventContextArgs)
      console.log('here111', contextId)
      await t.none(sql, args)
      console.log('here2222', contextId)
    })
  }
}
