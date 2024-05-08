import { BaseType, EventDb } from '../BaseType.js'
import { BigNumber } from 'ethers'
import { getItemsWithContext, selectEventContextSql, eventContextIdCreationSql, getInsertEventContextSqlData } from '../context.js'
import { v4 as uuid } from 'uuid'

export interface TransferBonded extends BaseType {
  pathId: string
  transferId: string
  checkpoint: string
  to: string
  amountOut: BigNumber
  totalSent: BigNumber
}

export class TransferBondedTable extends EventDb {
  override async createTable () {
    await this.db.query(`CREATE TABLE IF NOT EXISTS transfer_bonded_events (
        id TEXT PRIMARY KEY,
        path_id VARCHAR NOT NULL,
        transfer_id VARCHAR NOT NULL UNIQUE,
        checkpoint VARCHAR NOT NULL,
        "to" VARCHAR NOT NULL,
        amount_out NUMERIC NOT NULL,
        total_sent NUMERIC NOT NULL,
        ${eventContextIdCreationSql}
    )`)
  }

  override async createIndexes () {
    await this.db.query(
      'CREATE UNIQUE INDEX IF NOT EXISTS idx_transfer_bonded_events_bundle_id ON transfer_bonded_events (transfer_id);'
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
    } else if (filter?.checkpoint) {
      args.push(filter.checkpoint)
    } else if (filter?.pathId) {
      args.push(filter.pathId)
    } else if (filter?.transactionHash) {
      args.push(filter.transactionHash)
    }

    const items = await this.db.any(
      `SELECT
        path_id AS "pathId",
        transfer_id AS "transferId",
        checkpoint,
        "to",
        amount_out AS "amountOut",
        total_sent AS "totalSent",
        ${selectEventContextSql}
      FROM
        transfer_bonded_events e
      JOIN
        event_context ec ON e.event_context_id = ec.id
      WHERE
        ec.block_timestamp >= $1
        AND
        ec.block_timestamp <= $2
        ${filter?.transferId ? 'AND transfer_id= $5' : ''}
        ${filter?.checkpoint ? 'AND checkpoint= $5' : ''}
        ${filter?.pathId ? 'AND path_id = $5' : ''}
        ${filter?.transactionHash ? 'AND ec.transaction_hash = $5' : ''}
      ORDER BY
        ec.block_timestamp
      DESC
      LIMIT $3
      OFFSET $4`,
      args)

    return getItemsWithContext(items)
  }

  override async upsertItem (item: any) {
    const { pathId, transferId, checkpoint, to, amountOut, totalSent, context } = this.#normalizeDataForPut(item)
    const {
      contextId,
      insertEventContextArgs,
      insertEventContextSql
    } = getInsertEventContextSqlData(context)
    const args = {
      id: uuid(), contextId, pathId, transferId, checkpoint, to, amountOut, totalSent
    }
    const sql = `
      INSERT INTO
        transfer_bonded_events
      (
        id, event_context_id, path_id, transfer_id, checkpoint, "to", amount_out, total_sent
      )
      VALUES ${'(${id}, ${contextId}, ${pathId}, ${transferId}, ${checkpoint}, ${to}, ${amountOut}, ${totalSent})'}
      ON CONFLICT (transfer_id)
      ${'DO UPDATE SET path_id = ${pathId}'}
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
    if (data.amountOut && typeof data.amountOut === 'string') {
      data.amountOut = BigNumber.from(data.amountOut)
    }
    if (data.totalSent && typeof data.totalSent === 'string') {
      data.totalSent = BigNumber.from(data.totalSent)
    }
    return data
  }

  #normalizeDataForPut (putData: Partial<TransferBonded>): Partial<TransferBonded> {
    const data = Object.assign({}, putData) as any
    if (data.amountOut && typeof data.amountOut !== 'string') {
      data.amountOut = data.amountOut.toString()
    }
    if (data.totalSent && typeof data.totalSent !== 'string') {
      data.totalSent = data.totalSent.toString()
    }

    return data
  }
}
