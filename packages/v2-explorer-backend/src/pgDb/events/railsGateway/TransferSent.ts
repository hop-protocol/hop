import { BaseType, EventDb } from '../BaseType.js'
import { BigNumber } from 'ethers'
import { contextSqlCreation, contextSqlInsert, contextSqlSelect, getItemsWithContext, getOrderedInsertContextArgs } from '../context.js'
import { v4 as uuid } from 'uuid'

export interface TransferSent extends BaseType {
  transferId: string
  pathId: string
  to: string
  amount: BigNumber
  minAmountOut: BigNumber
  totalSent: BigNumber
}

export class TransferSentTable extends EventDb {
  override async createTable () {
    await this.db.query(`CREATE TABLE IF NOT EXISTS transfer_sent_events (
        id TEXT PRIMARY KEY,
        transfer_id VARCHAR NOT NULL UNIQUE,
        path_id VARCHAR NOT NULL,
        "to" VARCHAR NOT NULL,
        amount NUMERIC NOT NULL,
        min_amount_out NUMERIC NOT NULL,
        total_sent NUMERIC NOT NULL,
        ${contextSqlCreation}
    )`)
  }

  override async createIndexes () {
    await this.db.query(
      'CREATE UNIQUE INDEX IF NOT EXISTS idx_transfer_sent_events_bundle_id ON transfer_sent_events (transfer_id);'
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
    }

    const items = await this.db.any(
      `SELECT
        transfer_id AS "transferId",
        path_id AS "pathId",
        "to",
        amount,
        min_amount_out AS "minAmountOut",
        total_sent AS "totalSent",
        ${contextSqlSelect}
      FROM
        transfer_sent_events
      WHERE
        _block_timestamp >= $1
        AND
        _block_timestamp <= $2
        ${filter?.transferId ? 'AND transfer_id= $5' : ''}
        ${filter?.pathId ? 'AND path_id = $5' : ''}
        ${filter?.transactionHash ? 'AND _transaction_hash = $5' : ''}
      ORDER BY
        _block_timestamp
      DESC
      LIMIT $3
      OFFSET $4`,
      args)

    return getItemsWithContext(items)
  }

  override async upsertItem (item: any) {
    const { transferId, pathId, to, amount, minAmountOut, totalSent, context } = this.#normalizeDataForPut(item)
    const args = {
      id: uuid(), transferId, pathId, to, amount, minAmountOut, totalSent,
      context
    }
    await this.db.query(
      `INSERT INTO
        transfer_sent_events
      (
        id, transfer_id, path_id, "to", amount, min_amount_out, total_sent,
        ${contextSqlInsert}
      )
      VALUES ($\{id\}, $\{transferId\}, $\{pathId\}, $\{to\}, $\{amount\}, $\{minAmountOut\}, $\{totalSent\}, $\{context.chainId\}, $\{context.transactionHash\}, $\{context.transactionIndex\}, $\{context.logIndex\}, $\{context.blockNumber\}, $\{context.fromAddress\}, $\{context.toAddress\}, $\{context.value\}, $\{context.nonce\}, $\{context.gasLimit\}, $\{context.gasUsed\}, $\{context.gasPrice\}, $\{context.data\})
      ON CONFLICT (transfer_id)
      DO UPDATE SET _block_timestamp = $\{context.blockTimestamp\}, _transaction_hash = $\{context.transactionHash\}`, args
    )
  }

  #normalizeDataForGet (getData: Partial<TransferSent>): Partial<TransferSent> {
    if (!getData) {
      return getData
    }
    const data = Object.assign({}, getData)
    if (data.amount && typeof data.amount === 'string') {
      data.amount = BigNumber.from(data.amount)
    }
    if (data.minAmountOut && typeof data.minAmountOut === 'string') {
      data.minAmountOut = BigNumber.from(data.minAmountOut)
    }
    if (data.totalSent && typeof data.totalSent === 'string') {
      data.totalSent = BigNumber.from(data.totalSent)
    }
    return data
  }

  #normalizeDataForPut (putData: Partial<TransferSent>): Partial<TransferSent> {
    const data = Object.assign({}, putData) as any
    if (data.amount && typeof data.amount !== 'string') {
      data.amount = data.amount.toString()
    }
    if (data.minAmountOut && typeof data.minAmountOut !== 'string') {
      data.minAmountOut = data.minAmountOut.toString()
    }
    if (data.totalSent && typeof data.totalSent !== 'string') {
      data.totalSent = data.totalSent.toString()
    }

    return data
  }
}
