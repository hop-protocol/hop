import { BaseType } from './BaseType'
import { BigNumber } from 'ethers'
import { contextSqlCreation, contextSqlInsert, contextSqlSelect, getItemsWithContext, getOrderedInsertContextArgs } from './context'
import { v4 as uuid } from 'uuid'

export interface BundleReceived extends BaseType {
  bundleId: string
  bundleRoot: string
  bundleFees: BigNumber
  fromChainId: number
  toChainId: number
  relayWindowStart: number
  relayer: string
}

export class BundleReceived {
  db: any

  constructor (db: any) {
    this.db = db
  }

  async createTable () {
    await this.db.query(`CREATE TABLE IF NOT EXISTS bundle_received_events (
        id TEXT PRIMARY KEY,
        bundle_id VARCHAR NOT NULL UNIQUE,
        bundle_root VARCHAR NOT NULL UNIQUE,
        bundle_fees NUMERIC NOT NULL,
        from_chain_id VARCHAR NOT NULL,
        to_chain_id VARCHAR NOT NULL,
        relay_window_start INTEGER NOT NULL,
        relayer VARCHAR NOT NULL,
        ${contextSqlCreation}
    )`)
  }

  async createIndexes () {
    await this.db.query(
      'CREATE UNIQUE INDEX IF NOT EXISTS idx_bundle_received_events_bundle_id ON bundle_received_events (bundle_id);'
    )
    await this.db.query(
      'CREATE UNIQUE INDEX IF NOT EXISTS idx_bundle_received_events_bundle_root ON bundle_received_events (bundle_root);'
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
    } else if (filter?.bundleRoot) {
      args.push(filter.bundleRoot)
    } else if (filter?.transactionHash) {
      args.push(filter.transactionHash)
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
        ${contextSqlSelect}
      FROM
        bundle_received_events
      WHERE
        _block_timestamp >= $1
        AND
        _block_timestamp <= $2
        ${filter?.bundleId ? 'AND bundle_id = $5' : ''}
        ${filter?.bundleRoot ? 'AND bundle_root = $5' : ''}
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
    const { bundleId, bundleRoot, bundleFees, fromChainId, toChainId, relayWindowStart, relayer, context } = this.normalizeDataForPut(item)
    const args = [
      uuid(), bundleId, bundleRoot, bundleFees, fromChainId, toChainId, relayWindowStart, relayer,
      ...getOrderedInsertContextArgs(context)
    ]
    await this.db.query(
      `INSERT INTO
        bundle_received_events
      (
        id, bundle_id, bundle_root, bundle_fees, from_chain_id, to_chain_id, relay_window_start, relayer,
        ${contextSqlInsert}
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
      ON CONFLICT (bundle_id)
      DO UPDATE SET _block_timestamp = $15, _transaction_hash = $11`, args
    )
  }

  normalizeDataForGet (getData: Partial<BundleReceived>): Partial<BundleReceived> {
    if (!getData) {
      return getData
    }
    const data = Object.assign({}, getData)
    if (data.bundleFees && typeof data.bundleFees === 'string') {
      data.bundleFees = BigNumber.from(data.bundleFees)
    }
    return data
  }

  normalizeDataForPut (putData: Partial<BundleReceived>): Partial<BundleReceived> {
    const data = Object.assign({}, putData) as any
    if (data.bundleFees && typeof data.bundleFees !== 'string') {
      data.bundleFees = data.bundleFees.toString()
    }

    return data
  }
}
