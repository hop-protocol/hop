import { BaseType, EventDb } from '../BaseType.js'
import { getItemsWithContext, selectEventContextSql, eventContextIdCreationSql, getInsertEventContextSqlData } from '../context.js'
import { v4 as uuid } from 'uuid'

export interface BundleForwared extends BaseType {
  bundleId: string
  bundleRoot: string
  fromChainId: string
  toChainId: string
}

export class BundleForwardedTable extends EventDb {
  override async createTable () {
    await this.db.query(`CREATE TABLE IF NOT EXISTS bundle_forwarded_events (
        id TEXT PRIMARY KEY,
        bundle_id CHAR(66) NOT NULL UNIQUE,
        bundle_root CHAR(66) NOT NULL UNIQUE,
        from_chain_id NUMERIC(78, 0) NOT NULL CHECK (from_chain_id >= 0), -- uint256
        to_chain_id NUMERIC(78, 0) NOT NULL CHECK (to_chain_id >= 0), -- uint256
        ${eventContextIdCreationSql}
    )`)
  }

  override async createIndexes () {
    await this.db.query(
      'CREATE UNIQUE INDEX IF NOT EXISTS idx_bundle_forwareded_events_bundle_id ON bundle_forwarded_events (bundle_id);'
    )
    await this.db.query(
      'CREATE UNIQUE INDEX IF NOT EXISTS idx_bundle_forwareded_events_bundle_root ON bundle_forwarded_events (bundle_root);'
    )
    await this.db.query(
      'CREATE INDEX IF NOT EXISTS idx_bundle_forwareded_events_from_chain_id ON bundle_forwarded_events (from_chain_id);'
    )
    await this.db.query(
      'CREATE INDEX IF NOT EXISTS idx_bundle_forwareded_events_to_chain_id ON bundle_forwarded_events (to_chain_id);'
    )
    await this.db.query(
      'CREATE INDEX IF NOT EXISTS idx_bundle_forwareded_events_event_context_id ON bundle_forwarded_events (event_context_id);'
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
    } else if (filter?.bundleRoot) {
      args.push(filter.bundleRoot)
    } else if (filter?.transactionHash) {
      args.push(filter.transactionHash)
    } else if (filter?.fromChainId) {
      args.push(filter.fromChainId)
    } else if (filter?.toChainId) {
      args.push(filter.toChainId)
    } else if (filter?.eventChainId) {
      args.push(filter.eventChainId)
    }

    const items = await this.db.any(
      `SELECT
        bundle_id AS "bundleId",
        bundle_root AS "bundleRoot",
        from_chain_id AS "fromChainId",
        to_chain_id AS "toChainId",
        ${selectEventContextSql}
      FROM
        bundle_forwarded_events e
      JOIN
        event_context ec ON e.event_context_id = ec.id
      WHERE
        ec.block_timestamp >= $1
        AND
        ec.block_timestamp <= $2
        ${filter?.bundleId ? 'AND bundle_id = $5' : ''}
        ${filter?.bundleRoot ? 'AND bundle_root = $5' : ''}
        ${filter?.fromChainId ? 'AND from_chain_id = $5' : ''}
        ${filter?.toChainId ? 'AND to_chain_id = $5' : ''}
        ${filter?.transactionHash ? 'AND ec.transaction_hash = $5' : ''}
        ${filter?.eventChainId ? 'AND ec.chain_id = $5' : ''}
      ORDER BY
        ec.block_timestamp
      DESC
      LIMIT $3
      OFFSET $4`,
      args)

    return getItemsWithContext(items)
  }

  override async upsertItem (item: any) {
    const { bundleId, bundleRoot, fromChainId, toChainId, context } = item
    const {
      contextId,
      insertEventContextArgs,
      insertEventContextSql
    } = getInsertEventContextSqlData(context)
    const args = {
      id: uuid(), contextId, bundleId, bundleRoot, fromChainId, toChainId,
    }
    const sql = `
      INSERT INTO
        bundle_forwarded_events
      (
        id, event_context_id, bundle_id, bundle_root, from_chain_id, to_chain_id
      )
      VALUES ${'(${id}, ${contextId}, ${bundleId}, ${bundleRoot}, ${fromChainId}, ${toChainId})'}
      ON CONFLICT (bundle_id)
      ${'DO UPDATE SET bundle_id = ${bundleId}, bundle_root = ${bundleRoot}, from_chain_id = ${fromChainId}, to_chain_id = ${toChainId}'}
    `

    await this.db.tx(async (t: any) => {
      await t.none(insertEventContextSql, insertEventContextArgs)
      await t.none(sql, args)
    })
  }
}
