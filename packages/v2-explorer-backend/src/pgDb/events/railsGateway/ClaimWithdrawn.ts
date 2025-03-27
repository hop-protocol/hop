import { BaseType, EventDb } from '../BaseType.js'
import { getItemsWithContext, selectEventContextSql, eventContextIdCreationSql, getInsertEventContextSqlData } from '../context.js'
import { v4 as uuid } from 'uuid'

export interface ClaimWithdrawn extends BaseType {
  pathId: string
  claimId: string
}

export class ClaimWithdrawnTable extends EventDb {
  override async createTable () {
    await this.db.query(`CREATE TABLE IF NOT EXISTS claim_withdrawn_events (
        id TEXT PRIMARY KEY,
        path_id CHAR(66) NOT NULL,
        claim_id CHAR(66) NOT NULL UNIQUE,
        ${eventContextIdCreationSql}
    )`)
  }

  override async createIndexes () {
    await this.db.query(
      'CREATE UNIQUE INDEX IF NOT EXISTS idx_claim_withdrawn_events_claim_id ON claim_withdrawn_events (claim_id);'
    )
    await this.db.query(
      'CREATE INDEX IF NOT EXISTS idx_claim_withdrawn_events_path_id ON claim_withdrawn_events (path_id);'
    )
    await this.db.query(
      'CREATE INDEX IF NOT EXISTS idx_claim_withdrawn_events_event_context_id ON claim_withdrawn_events (event_context_id);'
    )
    await this.db.query(
      'CREATE UNIQUE INDEX IF NOT EXISTS idx_claim_withdrawn_events_path_id_and_claim_id ON claim_withdrawn_events (path_id, claim_id);'
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
        claim_withdrawn_events e
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

    const itemsWithContext = getItemsWithContext(items).map(item => this.#normalizeDataForGet(item))

    return itemsWithContext.map((item, index) => {
      return {
        ...item,
        i: (page - 1) * limit + index + 1
      }
    })
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
        claim_withdrawn_events
      (
        id, event_context_id, path_id, claim_id
      )
      VALUES ${'(${id}, ${contextId}, ${pathId}, ${claimId})'}
      ON CONFLICT (path_id, claim_id)
      ${'DO UPDATE SET claim_id = ${claimId}, path_id = ${pathId}'}
    `

    await this.db.tx(async (t: any) => {
      await t.none(insertEventContextSql, insertEventContextArgs)
      await t.none(sql, args)
    })
  }

  #normalizeDataForGet (getData: Partial<ClaimWithdrawn>): Partial<ClaimWithdrawn> {
    if (!getData) {
      return getData
    }

    const data = Object.assign({}, getData)
    return data
  }

  #normalizeDataForPut (putData: Partial<ClaimWithdrawn>): Partial<ClaimWithdrawn> {
    const data = Object.assign({}, putData) as any

    return data
  }
}
