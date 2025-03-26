import { BaseType, EventDb } from '../BaseType.js'
import { BigNumber } from 'ethers'
import { getItemsWithContext, selectEventContextSql, eventContextIdCreationSql, getInsertEventContextSqlData } from '../context.js'
import { v4 as uuid } from 'uuid'

export interface BundleReceived extends BaseType {
  bundleId: string
  bundleRoot: string
  bundleFees: BigNumber
  fromChainId: string
  toChainId: string
  relayWindowStart: number
  relayer: string
}

export class BundleReceivedTable extends EventDb {
  override async createTable () {
    await this.db.query(`CREATE TABLE IF NOT EXISTS bundle_received_events (
        id TEXT PRIMARY KEY,
        bundle_id CHAR(66) NOT NULL UNIQUE,
        bundle_root CHAR(66) NOT NULL UNIQUE,
        bundle_fees NUMERIC NOT NULL CHECK (bundle_fees >= 0),
        from_chain_id NUMERIC(78, 0) NOT NULL CHECK (from_chain_id >= 0), -- uint256
        to_chain_id NUMERIC(78, 0) NOT NULL CHECK (to_chain_id >= 0), -- uint256
        relay_window_start INTEGER NOT NULL CHECK (relay_window_start >= 0),
        relayer CHAR(42) NOT NULL, -- Ethereum address
        ${eventContextIdCreationSql}
    )`)
  }

  override async createIndexes () {
    await this.db.query(
      'CREATE UNIQUE INDEX IF NOT EXISTS idx_bundle_received_events_bundle_id ON bundle_received_events (bundle_id);'
    )
    await this.db.query(
      'CREATE UNIQUE INDEX IF NOT EXISTS idx_bundle_received_events_bundle_root ON bundle_received_events (bundle_root);'
    )
    await this.db.query(
      'CREATE INDEX IF NOT EXISTS idx_bundle_received_events_from_chain_id ON bundle_received_events (from_chain_id);'
    )
    await this.db.query(
      'CREATE INDEX IF NOT EXISTS idx_bundle_received_events_to_chain_id ON bundle_received_events (to_chain_id);'
    )
    await this.db.query(
      'CREATE INDEX IF NOT EXISTS idx_bundle_received_events_relayer ON bundle_received_events (relayer);'
    )
    await this.db.query(
      'CREATE INDEX IF NOT EXISTS idx_bundle_received_events_event_context_id ON bundle_received_events (event_context_id);'
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
    } else if (filter?.relayer) {
      args.push(filter.relayer)
    } else if (filter?.toChainId) {
      args.push(filter.toChainId)
    } else if (filter?.eventChainId) {
      args.push(filter.eventChainId)
    }

    const items = await this.db.any(
      `SELECT
        bundle_id AS "bundleId",
        bundle_root AS "bundleRoot",
        bundle_fees AS "bundleFees",
        from_chain_id AS "fromChainId",
        to_chain_id AS "toChainId",
        relay_window_start AS "relayWindowStart",
        relayer,
        ${selectEventContextSql}
      FROM
        bundle_received_events e
      JOIN
        event_context ec ON e.event_context_id = ec.id
      WHERE
        ec.block_timestamp >= $1
        AND
        ec.block_timestamp <= $2
        ${filter?.bundleId ? 'AND bundle_id = $5' : ''}
        ${filter?.bundleRoot ? 'AND bundle_root = $5' : ''}
        ${filter?.relayer ? 'AND relayer = $5' : ''}
        ${filter?.toChainId ? 'AND to_chain_id = $5' : ''}
        ${filter?.transactionHash ? 'AND ec.transaction_hash = $5' : ''}
        ${filter?.eventChainId ? 'AND ec.chain_id = $5' : ''}
      ORDER BY
        ec.block_timestamp
      DESC
      LIMIT $3
      OFFSET $4`,
      args)

    const itemsWithContext = getItemsWithContext(items).map(item => this.#normalizeDataForGet(item))

    return itemsWithContext.map((item, index) => {
      return {
        ...item,
        i: (page - 1) * limit + index + 1
      }
    })
  }

  override async upsertItem (item: any) {
    const { bundleId, bundleRoot, bundleFees, fromChainId, toChainId, relayWindowStart, relayer, context } = this.#normalizeDataForPut(item)
    const {
      contextId,
      insertEventContextArgs,
      insertEventContextSql
    } = getInsertEventContextSqlData(context)
    const args = {
      id: uuid(), contextId, bundleId, bundleRoot, bundleFees, fromChainId, toChainId, relayWindowStart, relayer
    }
    const sql = `
      INSERT INTO
        bundle_received_events
      (
        id, event_context_id, bundle_id, bundle_root, bundle_fees, from_chain_id, to_chain_id, relay_window_start, relayer
      )
      VALUES ${'(${id}, ${contextId}, ${bundleId}, ${bundleRoot}, ${bundleFees}, ${fromChainId}, ${toChainId}, ${relayWindowStart}, ${relayer})'}
      ON CONFLICT (bundle_id)
      ${'DO UPDATE SET bundle_id = ${bundleId}, bundle_root = ${bundleRoot}, bundle_fees = ${bundleFees}, from_chain_id = ${fromChainId}, to_chain_id = ${toChainId}, relay_window_start = ${relayWindowStart}, relayer = ${relayer}'}
    `

    await this.db.tx(async (t: any) => {
      await t.none(insertEventContextSql, insertEventContextArgs)
      await t.none(sql, args)
    })
  }

  #normalizeDataForGet (getData: Partial<BundleReceived>): Partial<BundleReceived> {
    if (!getData) {
      return getData
    }
    const data = Object.assign({}, getData)
    if (data.bundleFees && typeof data.bundleFees === 'string') {
      data.bundleFees = BigNumber.from(data.bundleFees)
    }
    return data
  }

  #normalizeDataForPut (putData: Partial<BundleReceived>): Partial<BundleReceived> {
    const data = Object.assign({}, putData) as any
    if (data.bundleFees && typeof data.bundleFees !== 'string') {
      data.bundleFees = data.bundleFees.toString()
    }

    return data
  }
}
