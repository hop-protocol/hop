import { BaseType, EventDb } from '../BaseType.js'
import { BigNumber } from 'ethers'
import { getItemsWithContext, selectEventContextSql, eventContextIdCreationSql, getInsertEventContextSqlData } from '../context.js'
import { v4 as uuid } from 'uuid'

export interface BundleCommitted extends BaseType {
  bundleId: string
  bundleRoot: string
  bundleFees: BigNumber
  toChainId: string
  commitTime: number
}

export class BundleCommittedTable extends EventDb {
  override async createTable () {
    await this.db.query(`CREATE TABLE IF NOT EXISTS bundle_committed_events (
        id TEXT PRIMARY KEY,
        bundle_id CHAR(66) NOT NULL UNIQUE,
        bundle_root CHAR(66) NOT NULL UNIQUE,
        bundle_fees NUMERIC NOT NULL CHECK (bundle_fees >= 0),
        to_chain_id NUMERIC(78, 0) NOT NULL CHECK (to_chain_id >= 0), -- uint256
        commit_time INTEGER NOT NULL CHECK (commit_time >= 0),
        ${eventContextIdCreationSql}
    )`)
  }

  override async createIndexes () {
    await this.db.query(
      'CREATE UNIQUE INDEX IF NOT EXISTS idx_bundle_committed_events_bundle_id ON bundle_committed_events (bundle_id);'
    )
    await this.db.query(
      'CREATE UNIQUE INDEX IF NOT EXISTS idx_bundle_committed_events_bundle_root ON bundle_committed_events (bundle_root);'
    )
    await this.db.query(
      'CREATE INDEX IF NOT EXISTS idx_bundle_committed_events_bundle_id ON bundle_committed_events (bundle_id);'
    )
    await this.db.query(
      'CREATE INDEX IF NOT EXISTS idx_bundle_committed_events_to_chain_id ON bundle_committed_events (to_chain_id);'
    )
    await this.db.query(
      'CREATE INDEX IF NOT EXISTS idx_bundle_committed_events_event_context_id ON bundle_committed_events (event_context_id);'
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
        to_chain_id AS "toChainId",
        commit_time AS "commitTime",
        ${selectEventContextSql}
      FROM
        bundle_committed_events e
      JOIN
        event_context ec ON e.event_context_id = ec.id
      WHERE
        ec.block_timestamp >= $1
        AND
        ec.block_timestamp <= $2
        ${filter?.bundleId ? 'AND bundle_id = $5' : ''}
        ${filter?.bundleRoot ? 'AND bundle_root = $5' : ''}
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
    const { bundleId, bundleRoot, bundleFees, toChainId, commitTime, context } = this.#normalizeDataForPut(item)
    const {
      contextId,
      insertEventContextArgs,
      insertEventContextSql
    } = getInsertEventContextSqlData(context)
    const args = {
      id: uuid(), contextId, bundleId, bundleRoot, bundleFees, toChainId, commitTime
    }
    const sql = `
      INSERT INTO
        bundle_committed_events
      (
        id, event_context_id, bundle_id, bundle_root, bundle_fees, to_chain_id, commit_time
      )
      VALUES ${'(${id}, ${contextId}, ${bundleId}, ${bundleRoot}, ${bundleFees}, ${toChainId}, ${commitTime})'}
      ON CONFLICT (bundle_id)
      ${'DO UPDATE SET bundle_id = ${bundleId}, to_chain_id = ${toChainId}, commit_time = ${commitTime}, bundle_fees = ${bundleFees}'}
    `

    await this.db.tx(async (t: any) => {
      await t.none(insertEventContextSql, insertEventContextArgs)
      await t.none(sql, args)
    })
  }

  #normalizeDataForGet (getData: Partial<BundleCommitted>): Partial<BundleCommitted> {
    if (!getData) {
      return getData
    }
    const data = Object.assign({}, getData)
    if (data.bundleFees && typeof data.bundleFees === 'string') {
      data.bundleFees = BigNumber.from(data.bundleFees)
    }
    return data
  }

  #normalizeDataForPut (putData: Partial<BundleCommitted>): Partial<BundleCommitted> {
    const data = Object.assign({}, putData) as any
    if (data.bundleFees && typeof data.bundleFees !== 'string') {
      data.bundleFees = data.bundleFees.toString()
    }

    return data
  }
}
