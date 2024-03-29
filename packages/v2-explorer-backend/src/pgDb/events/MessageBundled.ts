import { BaseType } from './BaseType'
import { contextSqlCreation, contextSqlInsert, contextSqlSelect, getItemsWithContext, getOrderedInsertContextArgs } from './context'
import { v4 as uuid } from 'uuid'

export interface MessageBundled extends BaseType {
  messageId: string
  bundleId: string
  treeIndex: number
}

export class MessageBundled {
  db: any

  constructor (db: any) {
    this.db = db
  }

  async createTable () {
    await this.db.query(`CREATE TABLE IF NOT EXISTS message_bundled_events (
        id TEXT PRIMARY KEY,
        message_id VARCHAR NOT NULL UNIQUE,
        bundle_id VARCHAR NOT NULL,
        tree_index INTEGER NOT NULL,
        ${contextSqlCreation}
    )`)
  }

  async createIndexes () {
    await this.db.query(
      'CREATE UNIQUE INDEX IF NOT EXISTS idx_message_bundled_events_message_id_bundle_id ON message_bundled_events (message_id, bundle_id);'
    )
    await this.db.query(
      'CREATE UNIQUE INDEX IF NOT EXISTS idx_message_bundled_events_message_id ON message_bundled_events (message_id);'
    )
  }

  async getItems (opts: any = {}) {
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
        ${contextSqlSelect}
      FROM
        message_bundled_events
      WHERE
        _block_timestamp >= $1
        AND
        _block_timestamp <= $2
        ${filter?.bundleId ? 'AND bundle_id = $5' : ''}
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
    const { messageId, bundleId, treeIndex, context } = item
    const args = [
      uuid(), messageId, bundleId, treeIndex,
      ...getOrderedInsertContextArgs(context)
    ]
    await this.db.query(
      `INSERT INTO
        message_bundled_events
      (
        id, message_id, bundle_id, tree_index,
        ${contextSqlInsert}
      )
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
      ON CONFLICT (message_id)
      DO UPDATE SET _block_timestamp = $11, _transaction_hash = $7, bundle_id = $3`, args
    )
  }
}
