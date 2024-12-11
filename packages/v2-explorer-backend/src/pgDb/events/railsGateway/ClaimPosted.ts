import { BaseType, EventDb } from '../BaseType.js'
import { BigNumber } from 'ethers'
import { getItemsWithContext, selectEventContextSql, eventContextIdCreationSql, getInsertEventContextSqlData } from '../context.js'
import { v4 as uuid } from 'uuid'

export interface ClaimPosted extends BaseType {
  pathId: string
  claimId: string
}

export class ClaimPostedTable extends EventDb {
  override async createTable () {
    await this.db.query(`CREATE TABLE IF NOT EXISTS claim_posted_events (
        id TEXT PRIMARY KEY,
        path_id CHAR(66) NOT NULL,
        claim_id CHAR(66) NOT NULL UNIQUE,
        ${eventContextIdCreationSql}
    )`)
  }

  override async createIndexes () {
    await this.db.query(
      'CREATE UNIQUE INDEX IF NOT EXISTS idx_claim_posted_events_claim_id ON claim_posted_events (claim_id);'
    )
    await this.db.query(
      'CREATE INDEX IF NOT EXISTS idx_claim_posted_events_path_id ON claim_posted_events (path_id);'
    )
    await this.db.query(
      'CREATE INDEX IF NOT EXISTS idx_claim_posted_events_event_context_id ON claim_posted_events (event_context_id);'
    )
  }

  override async getItems (opts: any = {}) {
    const { startTimestamp = 0, endTimestamp = Math.floor(Date.now() / 1000), limit = 10, page = 1, filter } = opts
    let offset = (page - 1) * limit
    if (offset < 0) {
      offset = 0
    }

    const args = [startTimestamp, endTimestamp, limit, offset]
    if (filter?.claimId) {
      args.push(filter.claimId)
    } else if (filter?.pathId) {
      args.push(filter.pathId)
    } else if (filter?.transactionHash) {
      args.push(filter.transactionHash)
    } else if (filter?.eventChainId) {
      args.push(filter.eventChainId)
    }

    const items = await this.db.any(
      `SELECT
        path_id AS "pathId",
        claim_id AS "claimId",
        ${selectEventContextSql}
      FROM
        claim_posted_events e
      JOIN
        event_context ec ON e.event_context_id = ec.id
      WHERE
        ec.block_timestamp >= $1
        AND
        ec.block_timestamp <= $2
        ${filter?.claimId ? 'AND claim_id = $5' : ''}
        ${filter?.pathId ? 'AND path_id = $5' : ''}
        ${filter?.transactionHash ? 'AND ec.transaction_hash = $5' : ''}
        ${filter?.eventChainId ? 'AND ec.chain_id = $5' : ''}
      ORDER BY
        ec.block_timestamp
      DESC
      LIMIT $3
      OFFSET $4`,
      args)

    return getItemsWithContext(items).map(item => this.#normalizeDataForGet(item))
  }

  override async upsertItem (item: any) {
    const { pathId, claimId, context } = this.#normalizeDataForPut(item)
    const {
      contextId,
      insertEventContextArgs,
      insertEventContextSql
    } = getInsertEventContextSqlData(context)
    const args = {
      id: uuid(), contextId, pathId, claimId
    }
    const sql = `
      INSERT INTO
        claim_posted_events
      (
        id, event_context_id, path_id, claim_id
      )
      VALUES ${'(${id}, ${contextId}, ${pathId}, ${claimId})'}
      ON CONFLICT (claim_id)
      ${'DO UPDATE SET claim_id = ${claimId}, path_id = ${pathId}'}
    `

    await this.db.tx(async (t: any) => {
      await t.none(insertEventContextSql, insertEventContextArgs)
      await t.none(sql, args)
    })
  }

  #normalizeDataForGet (getData: Partial<ClaimPosted>): Partial<ClaimPosted> {
    if (!getData) {
      return getData
    }

    const data = Object.assign({}, getData)
    return data
  }

  #normalizeDataForPut (putData: Partial<ClaimPosted>): Partial<ClaimPosted> {
    const data = Object.assign({}, putData) as any

    return data
  }
}
