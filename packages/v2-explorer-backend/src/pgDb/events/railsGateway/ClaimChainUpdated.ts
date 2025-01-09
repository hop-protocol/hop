import { BaseType, EventDb } from '../BaseType.js'
import { BigNumber } from 'ethers'
import { getItemsWithContext, selectEventContextSql, eventContextIdCreationSql, getInsertEventContextSqlData } from '../context.js'
import { v4 as uuid } from 'uuid'

export interface ClaimChainUpdated extends BaseType {
  pathId: string
  headClaimId: string
  length: BigNumber
}

export class ClaimChainUpdatedTable extends EventDb {
  override async createTable () {
    await this.db.query(`CREATE TABLE IF NOT EXISTS claim_chain_updated_events (
        id TEXT PRIMARY KEY,
        path_id CHAR(66) NOT NULL,
        head_claim_id CHAR(66) NOT NULL UNIQUE,
        length NUMERIC NOT NULL CHECK (length >= 0),
        ${eventContextIdCreationSql}
    )`)
  }

  override async createIndexes () {
    await this.db.query(
      'CREATE UNIQUE INDEX IF NOT EXISTS idx_claim_chain_updated_events_head_claim_id ON claim_chain_updated_events (head_claim_id);'
    )
    await this.db.query(
      'CREATE INDEX IF NOT EXISTS idx_claim_chain_updated_events_path_id ON claim_chain_updated_events (path_id);'
    )
    await this.db.query(
      'CREATE INDEX IF NOT EXISTS idx_claim_chain_updated_events_event_context_id ON claim_chain_updated_events (event_context_id);'
    )
    await this.db.query(
      'CREATE UNIQUE INDEX IF NOT EXISTS idx_claim_chain_updated_events_head_claim_id ON claim_chain_updated_events (head_claim_id);'
    )
  }

  override async getItems (opts: any = {}) {
    const { startTimestamp = 0, endTimestamp = Math.floor(Date.now() / 1000), limit = 10, page = 1, filter } = opts
    let offset = (page - 1) * limit
    if (offset < 0) {
      offset = 0
    }

    const args = [startTimestamp, endTimestamp, limit, offset]
    if (filter?.headClaimId) {
      args.push(filter.headClaimId)
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
        head_claim_id AS "headClaimId",
        length,
        ${selectEventContextSql}
      FROM
        claim_chain_updated_events e
      JOIN
        event_context ec ON e.event_context_id = ec.id
      WHERE
        ec.block_timestamp >= $1
        AND
        ec.block_timestamp <= $2
        ${filter?.headClaimId ? 'AND head_claim_id = $5' : ''}
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
    const { pathId, headClaimId, length, context } = this.#normalizeDataForPut(item)
    const {
      contextId,
      insertEventContextArgs,
      insertEventContextSql
    } = getInsertEventContextSqlData(context)
    const args = {
      id: uuid(), contextId, pathId, headClaimId, length
    }
    const sql = `
      INSERT INTO
        claim_chain_updated_events
      (
        id, event_context_id, path_id, head_claim_id, length
      )
      VALUES ${'(${id}, ${contextId}, ${pathId}, ${headClaimId}, ${length})'}
      ON CONFLICT (head_claim_id)
      ${'DO UPDATE SET head_claim_id = ${headClaimId}, path_id = ${pathId}, length = ${length}'}
    `

    await this.db.tx(async (t: any) => {
      await t.none(insertEventContextSql, insertEventContextArgs)
      await t.none(sql, args)
    })
  }

  #normalizeDataForGet (getData: Partial<ClaimChainUpdated>): Partial<ClaimChainUpdated> {
    if (!getData) {
      return getData
    }
    const data = Object.assign({}, getData)
    if (data.length && typeof data.length === 'string') {
      data.length = BigNumber.from(data.length)
    }
    return data
  }

  #normalizeDataForPut (putData: Partial<ClaimChainUpdated>): Partial<ClaimChainUpdated> {
    const data = Object.assign({}, putData) as any
    if (data.length && typeof data.length !== 'string') {
      data.length = data.length.toString()
    }

    return data
  }
}
