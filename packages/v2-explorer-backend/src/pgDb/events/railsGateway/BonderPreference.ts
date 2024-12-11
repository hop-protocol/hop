import { BaseType, EventDb } from '../BaseType.js'
import { BigNumber } from 'ethers'
import { getItemsWithContext, selectEventContextSql, eventContextIdCreationSql, getInsertEventContextSqlData } from '../context.js'
import { v4 as uuid } from 'uuid'

export interface BonderPreference extends BaseType {
  bonder: string
  pathId: string
  feeTier: BigNumber
  liquidity: BigNumber
}

export class BonderPreferenceTable extends EventDb {
  override async createTable () {
    await this.db.query(`CREATE TABLE IF NOT EXISTS bonder_preference_events (
        id TEXT PRIMARY KEY,
        bonder CHAR(42) NOT NULL,
        path_id CHAR(66) NOT NULL,
        fee_tier NUMERIC NOT NULL CHECK (fee_tier >= 0),
        liquidity NUMERIC NOT NULL CHECK (liquidity >= 0),
        ${eventContextIdCreationSql}
    )`)
  }

  override async createIndexes () {
    await this.db.query(
      'CREATE INDEX IF NOT EXISTS idx_bonder_preference_events_bonder ON bonder_preference_events (bonder);'
    )
    await this.db.query(
      'CREATE INDEX IF NOT EXISTS idx_bonder_preference_events_path_id ON bonder_preference_events (path_id);'
    )
    await this.db.query(
      'CREATE INDEX IF NOT EXISTS idx_bonder_preference_events_fee_tier ON bonder_preference_events (fee_tier);'
    )
    await this.db.query(
      'CREATE INDEX IF NOT EXISTS idx_bonder_preference_events_event_context_id ON bonder_preference_events (event_context_id);'
    )
  }

  override async getItems (opts: any = {}) {
    const { startTimestamp = 0, endTimestamp = Math.floor(Date.now() / 1000), limit = 10, page = 1, filter } = opts
    let offset = (page - 1) * limit
    if (offset < 0) {
      offset = 0
    }

    const args = [startTimestamp, endTimestamp, limit, offset]
    if (filter?.pathId) {
      args.push(filter.pathId)
    } else if (filter?.bonder) {
      args.push(filter.bonder)
    } else if (filter?.feeTier) {
      args.push(filter.feeTier)
    } else if (filter?.liquidity) {
      args.push(filter.liquidity)
    } else if (filter?.transactionHash) {
      args.push(filter.transactionHash)
    } else if (filter?.eventChainId) {
      args.push(filter.eventChainId)
    }

    const items = await this.db.any(
      `SELECT
        path_id AS "pathId",
        bonder,
        fee_tier AS "feeTier",
        liquidity,
        ${selectEventContextSql}
      FROM
        bonder_preference_events e
      JOIN
        event_context ec ON e.event_context_id = ec.id
      WHERE
        ec.block_timestamp >= $1
        AND
        ec.block_timestamp <= $2
        ${filter?.pathId ? 'AND path_id = $5' : ''}
        ${filter?.bonder ? 'AND bonder = $5' : ''}
        ${filter?.feeTier ? 'AND fee_tier = $5' : ''}
        ${filter?.liquidity ? 'AND liquidity = $5' : ''}
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
    const { pathId, bonder, feeTier, liquidity, context } = this.#normalizeDataForPut(item)
    const {
      contextId,
      insertEventContextArgs,
      insertEventContextSql
    } = getInsertEventContextSqlData(context)
    const args = {
      id: uuid(), contextId, pathId, bonder, feeTier, liquidity
    }
    const sql = `
      INSERT INTO
        bonder_preference_events
      (
        id, event_context_id, path_id, bonder, fee_tier, liquidity
      )
      VALUES ${'(${id}, ${contextId}, ${pathId}, ${bonder}, ${feeTier}, ${liquidity})'}
      ON CONFLICT (claim_id)
      ${'DO UPDATE SET bonder = ${bonder}, path_id = ${pathId}, fee_tier = ${feeTier}, liquidity = ${liquidity}'}
    `

    await this.db.tx(async (t: any) => {
      await t.none(insertEventContextSql, insertEventContextArgs)
      await t.none(sql, args)
    })
  }

  #normalizeDataForGet (getData: Partial<BonderPreference>): Partial<BonderPreference> {
    if (!getData) {
      return getData
    }
    const data = Object.assign({}, getData)
    if (data.feeTier && typeof data.feeTier === 'string') {
      data.feeTier = BigNumber.from(data.feeTier)
    }
    if (data.liquidity && typeof data.liquidity === 'string') {
      data.liquidity = BigNumber.from(data.liquidity)
    }
    return data
  }

  #normalizeDataForPut (putData: Partial<BonderPreference>): Partial<BonderPreference> {
    const data = Object.assign({}, putData) as any
    if (data.feeTier && typeof data.feeTier !== 'string') {
      data.feeTier = data.feeTier.toString()
    }
    if (data.liquidity && typeof data.liquidity !== 'string') {
      data.liquidity = data.liquidity.toString()
    }

    return data
  }
}
