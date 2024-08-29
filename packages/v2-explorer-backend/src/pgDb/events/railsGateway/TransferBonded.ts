import { BaseType, EventDb } from '../BaseType.js'
import { BigNumber } from 'ethers'
import { getItemsWithContext, selectEventContextSql, eventContextIdCreationSql, getInsertEventContextSqlData } from '../context.js'
import { v4 as uuid } from 'uuid'

export interface TransferBonded extends BaseType {
  pathId: string
  transferId: string
  amount: BigNumber
}

export class TransferBondedTable extends EventDb {
  override async createTable () {
    await this.db.query(`CREATE TABLE IF NOT EXISTS transfer_bonded_events (
        id TEXT PRIMARY KEY,
        path_id CHAR(66) NOT NULL,
        transfer_id CHAR(66) NOT NULL UNIQUE,
        amount NUMERIC NOT NULL CHECK (amount >= 0),
        ${eventContextIdCreationSql}
    )`)
  }

  override async createIndexes () {
    await this.db.query(
      'CREATE UNIQUE INDEX IF NOT EXISTS idx_transfer_bonded_events_bundle_id ON transfer_bonded_events (transfer_id);'
    )
    await this.db.query(
      'CREATE INDEX IF NOT EXISTS idx_transfer_bonded_events_path_id ON transfer_bonded_events (path_id);'
    )
    await this.db.query(
      'CREATE INDEX IF NOT EXISTS idx_transfer_bonded_events_event_context_id ON transfer_bonded_events (event_context_id);'
    )
  }

  override async getItems (opts: any = {}) {
    const { startTimestamp = 0, endTimestamp = Math.floor(Date.now() / 1000), limit = 10, page = 1, filter } = opts
    let offset = (page - 1) * limit
    if (offset < 0) {
      offset = 0
    }

    const args = [startTimestamp, endTimestamp, limit, offset]
    if (filter?.transferId) {
      args.push(filter.transferId)
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
        transfer_id AS "transferId",
        amount,
        ${selectEventContextSql}
      FROM
        transfer_bonded_events e
      JOIN
        event_context ec ON e.event_context_id = ec.id
      WHERE
        ec.block_timestamp >= $1
        AND
        ec.block_timestamp <= $2
        ${filter?.transferId ? 'AND transfer_id = $5' : ''}
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
    const { pathId, transferId, amount, context } = this.#normalizeDataForPut(item)
    const {
      contextId,
      insertEventContextArgs,
      insertEventContextSql
    } = getInsertEventContextSqlData(context)
    const args = {
      id: uuid(), contextId, pathId, transferId, amount
    }
    const sql = `
      INSERT INTO
        transfer_bonded_events
      (
        id, event_context_id, path_id, transfer_id, amount
      )
      VALUES ${'(${id}, ${contextId}, ${pathId}, ${transferId}, ${amount})'}
      ON CONFLICT (transfer_id)
      ${'DO UPDATE SET transfer_id = ${transferId}, path_id = ${pathId}, amount = ${amount}'}
    `

    await this.db.tx(async (t: any) => {
      await t.none(insertEventContextSql, insertEventContextArgs)
      await t.none(sql, args)
    })
  }

  #normalizeDataForGet (getData: Partial<TransferBonded>): Partial<TransferBonded> {
    if (!getData) {
      return getData
    }
    const data = Object.assign({}, getData)
    if (data.amount && typeof data.amount === 'string') {
      data.amount = BigNumber.from(data.amount)
    }
    return data
  }

  #normalizeDataForPut (putData: Partial<TransferBonded>): Partial<TransferBonded> {
    const data = Object.assign({}, putData) as any
    if (data.amount && typeof data.amount !== 'string') {
      data.amount = data.amount.toString()
    }

    return data
  }
}
