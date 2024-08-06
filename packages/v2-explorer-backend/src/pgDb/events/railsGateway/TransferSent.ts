import { BaseType, EventDb } from '../BaseType.js'
import { BigNumber } from 'ethers'
import { getItemsWithContext, selectEventContextSql, eventContextIdCreationSql, getInsertEventContextSqlData } from '../context.js'
import { v4 as uuid } from 'uuid'

export interface TransferSent extends BaseType {
  pathId: string
  transferId: string
  to: string
  amount: BigNumber
  attestationFee: BigNumber
  totalSent: BigNumber
  nonce: BigNumber
  previousTransferId: string
  attestedCheckpoint: string
}

export class TransferSentTable extends EventDb {
  override async createTable () {
    await this.db.query(`CREATE TABLE IF NOT EXISTS transfer_sent_events (
        id TEXT PRIMARY KEY,
        path_id CHAR(66) NOT NULL,
        transfer_id CHAR(66) NOT NULL UNIQUE,
        "to" CHAR(42) NOT NULL, -- Ethereum address
        amount NUMERIC NOT NULL CHECK (amount >= 0),
        attestation_fee NUMERIC NOT NULL CHECK (attestation_fee >= 0),
        nonce NUMERIC NOT NULL CHECK (nonce >= 0),
        previous_transfer_id CHAR(66),
        attested_checkpoint CHAR(66) NOT NULL,
        ${eventContextIdCreationSql}
    )`)
  }

  override async createIndexes () {
    await this.db.query(
      'CREATE UNIQUE INDEX IF NOT EXISTS idx_transfer_sent_events_transfer_id ON transfer_sent_events (transfer_id);'
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
    } else if (filter?.account) {
      args.push(filter.account)
    } else if (filter?.recipient) {
      args.push(filter.recipient)
    }

    const items = await this.db.any(
      `SELECT
        e.path_id AS "pathId",
        e.transfer_id AS "transferId",
        e."to",
        e.amount,
        e.attestation_fee AS "attestationFee",
        e.total_sent AS "totalSent",
        e.nonce,
        e.prevoius_transfer_id AS "previousTransferId",
        e.attested_checkpoint AS "attestedCheckpoint",
        ${selectEventContextSql}
      FROM
        transfer_sent_events e
      JOIN
        event_context ec ON e.event_context_id = ec.id
      LEFT OUTER JOIN
        transfer_bonded_events tbe ON e.transfer_id = tbe.transfer_id
      WHERE
        ec.block_timestamp >= $1
        AND
        ec.block_timestamp <= $2
        ${filter?.transferId ? 'AND e.transfer_id= $5' : ''}
        ${filter?.pathId ? 'AND e.path_id = $5' : ''}
        ${filter?.transactionHash ? 'AND ec.transaction_hash = $5' : ''}
        ${filter?.account ? 'AND ec.from_address = $5' : ''}
        ${filter?.recipient ? 'AND e."to" = $5' : ''}
        ${filter?.bonded != null ? 'AND tbe.transfer_id IS NOT NULL' : ''}
        ${filter?.pending != null ? 'AND tbe.transfer_id IS NULL' : ''}
      ORDER BY
        ec.block_timestamp
      DESC
      LIMIT $3
      OFFSET $4`,
      args)

    return getItemsWithContext(items)
  }

  override async upsertItem (item: any) {
    const { pathId, transferId, to, amount, attestationFee, totalSent, nonce, previousTransferId, attestedCheckpoint, context } = this.#normalizeDataForPut(item)
    const {
      contextId,
      insertEventContextArgs,
      insertEventContextSql
    } = getInsertEventContextSqlData(context)
    const args = {
      id: uuid(), contextId, pathId, transferId, to, amount, attestationFee, totalSent, nonce, previousTransferId, attestedCheckpoint,
    }
    const sql = `
      INSERT INTO
        transfer_sent_events
      (
        id, event_context_id, path_id, transfer_id, "to", amount, attestation_fee, total_sent, nonce, previous_transfer_id, attested_checkpoint
      )
      VALUES ${'(${id}, ${contextId}, ${pathId}, ${transferId}, ${to}, ${amount}, ${attestationFee}, ${totalSent}, ${nonce}, ${previousTransferId}, ${attestedCheckpoint})'}
      ON CONFLICT (transfer_id)
      ${'DO UPDATE SET path_id = ${pathId}'}
    `

    await this.db.tx(async (t: any) => {
      await t.none(insertEventContextSql, insertEventContextArgs)
      await t.none(sql, args)
    })
  }

  #normalizeDataForGet (getData: Partial<TransferSent>): Partial<TransferSent> {
    if (!getData) {
      return getData
    }
    const data = Object.assign({}, getData)
    if (data.amount && typeof data.amount === 'string') {
      data.amount = BigNumber.from(data.amount)
    }
    if (data.attestationFee && typeof data.attestationFee === 'string') {
      data.attestationFee = BigNumber.from(data.attestationFee)
    }
    if (data.totalSent && typeof data.totalSent === 'string') {
      data.totalSent = BigNumber.from(data.totalSent)
    }
    if (data.nonce && typeof data.nonce === 'string') {
      data.nonce = BigNumber.from(data.nonce)
    }
    return data
  }

  #normalizeDataForPut (putData: Partial<TransferSent>): Partial<TransferSent> {
    const data = Object.assign({}, putData) as any
    if (data.amount && typeof data.amount !== 'string') {
      data.amount = data.amount.toString()
    }
    if (data.attestationFee && typeof data.attestationFee !== 'string') {
      data.attestationFee = data.attestationFee.toString()
    }
    if (data.totalSent && typeof data.totalSent !== 'string') {
      data.totalSent = data.totalSent.toString()
    }
    if (data.nonce && typeof data.nonce !== 'string') {
      data.nonce = data.nonce.toString()
    }

    return data
  }
}
