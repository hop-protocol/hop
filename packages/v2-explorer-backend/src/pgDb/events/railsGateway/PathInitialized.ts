import { BaseType, EventDb } from '../BaseType.js'
import { getItemsWithContext, selectEventContextSql, eventContextIdCreationSql, getInsertEventContextSqlData } from '../context.js'
import { v4 as uuid } from 'uuid'
import { BigNumber } from 'ethers'

export interface PathInitialized extends BaseType {
  pathId: string
  token: string
  counterpartChainId: BigNumber
  counterpartToken: string
  initialReserve: BigNumber
  path: string
}

export class PathInitializedTable extends EventDb {
  override async createTable () {
    await this.db.query(`CREATE TABLE IF NOT EXISTS path_initialized_events (
        id TEXT PRIMARY KEY,
        path_id CHAR(66) NOT NULL,
        token VARCHAR(42) NOT NULL,
        counterpart_chain_id NUMERIC(78, 0) NOT NULL CHECK (initial_reserve >= 0),
        counterpart_token VARCHAR(42) NOT NULL,
        initial_reserve NUMERIC NOT NULL CHECK (initial_reserve >= 0),
        path VARCHAR(42) NOT NULL,
        ${eventContextIdCreationSql}
    )`)
  }

  override async createIndexes () {
    await this.db.query(
      'CREATE UNIQUE INDEX IF NOT EXISTS idx_path_initialized_events_path_id_token_counterpart_chain_id ON path_initialized_events (path_id, token, counterpart_chain_id);'
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
    } else if (filter?.transactionHash) {
      args.push(filter.transactionHash)
    } else if (filter?.eventChainId) {
      args.push(filter.eventChainId)
    }

    const items = await this.db.any(
      `SELECT
        path_id AS "pathId",
        token AS "token",
        counterpart_chain_id AS "counterpartChainId",
        counterpart_token AS "counterpartToken",
        initial_reserve AS "initialReserve",
        path AS "path",
        ${selectEventContextSql}
      FROM
        path_initialized_events e
      JOIN
        event_context ec ON e.event_context_id = ec.id
      WHERE
        ec.block_timestamp >= $1
        AND
        ec.block_timestamp <= $2
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
    const { pathId, token, counterpartChainId, counterpartToken, initialReserve, path, context } = this.#normalizeDataForPut(item)
    const {
      contextId,
      insertEventContextArgs,
      insertEventContextSql
    } = getInsertEventContextSqlData(context)
    const args = {
      id: uuid(), contextId, pathId, token, counterpartChainId, counterpartToken, initialReserve, path
    }
    const sql = `
      INSERT INTO
        path_initialized_events
      (
        id, event_context_id, path_id, token, counterpart_chain_id, counterpart_token, initial_reserve, path
      )
      VALUES ${'(${id}, ${contextId}, ${pathId}, ${token}, ${counterpartChainId}, ${counterpartToken}, ${initialReserve}, ${path})'}
      ON CONFLICT (path_id, token, counterpart_chain_id)
      ${'DO UPDATE SET path_id = ${pathId}, token = ${token}, counterpart_chain_id = ${counterpartChainId}, counterpart_token = ${counterpartToken}, initial_reserve = ${initialReserve}, path = ${path}'}
    `

    await this.db.tx(async (t: any) => {
      await t.none(insertEventContextSql, insertEventContextArgs)
      await t.none(sql, args)
    })
  }

  #normalizeDataForGet (getData: Partial<PathInitialized>): Partial<PathInitialized> {
    if (!getData) {
      return getData
    }

    const data = Object.assign({}, getData)

    data.counterpartChainId = BigNumber.from(data.counterpartChainId)
    data.initialReserve = BigNumber.from(data.initialReserve)

    return data
  }

  #normalizeDataForPut (putData: Partial<PathInitialized>): Partial<PathInitialized> {
    const data = Object.assign({}, putData) as any

    data.counterpartChainId = data.counterpartChainId.toString()
    data.initialReserve = data.initialReserve.toString()

    return data
  }
}
