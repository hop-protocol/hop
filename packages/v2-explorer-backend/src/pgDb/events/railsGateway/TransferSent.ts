import { BaseType, EventDb } from '../BaseType.js'
import { BigNumber } from 'ethers'
import { contextSqlCreation, contextSqlInsert, contextSqlSelect, getItemsWithContext, getOrderedInsertContextArgs } from '../context.js'
import { v4 as uuid } from 'uuid'

export interface TransferSent extends BaseType {
  pathId: string
  transferId: string
  checkpoint: string
  to: string
  amount: BigNumber
  attestationFee: BigNumber
  totalSent: BigNumber
  nonce: BigNumber
  attestedCheckpoint: string
}

export class TransferSentTable extends EventDb {
  override async createTable () {
    await this.db.query(`CREATE TABLE IF NOT EXISTS transfer_sent_events (
        id TEXT PRIMARY KEY,
        path_id VARCHAR NOT NULL,
        transfer_id VARCHAR NOT NULL UNIQUE,
        checkpoint VARCHAR NOT NULL UNIQUE,
        "to" VARCHAR NOT NULL,
        amount NUMERIC NOT NULL,
        attestation_fee NUMERIC NOT NULL,
        total_sent NUMERIC NOT NULL,
        nonce NUMERIC NOT NULL,
        attested_checkpoint VARCHAR NOT NULL,
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
        amount,
        attestation_fee AS "attestationFee",
        total_sent AS "totalSent",
        nonce,
        attested_checkpoint AS "attestedCheckpoint",
        ${contextSqlSelect}
      FROM
        transfer_sent_events
      WHERE
        _block_timestamp >= $1
        AND
        _block_timestamp <= $2
        ${filter?.transferId ? 'AND transfer_id= $5' : ''}
        ${filter?.checkpoint ? 'AND checkpoint= $5' : ''}
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
    const { pathId, transferId, checkpoint, to, amount, attestationFee, totalSent, nonce, attestedCheckpoint, context } = this.#normalizeDataForPut(item)
    const args = {
      id: uuid(), pathId, transferId, checkpoint, to, amount, attestationFee, totalSent, nonce, attestedCheckpoint,
      context
    }
    await this.db.query(
      `INSERT INTO
        transfer_sent_events
      (
        id, path_id, transfer_id, checkpoint, "to", amount, attestation_fee, total_sent, nonce, attested_checkpoint,
        ${contextSqlInsert}
      )
      VALUES ${'(${id}, ${pathId}, ${transferId}, ${checkpoint}, ${to}, ${amount}, ${attestationFee}, ${totalSent}, ${nonce}, ${attestedCheckpoint}, ${context.chainId}, ${context.transactionHash}, ${context.transactionIndex}, ${context.logIndex}, ${context.blockNumber}, ${context.blockTimestamp}, ${context.from}, ${context.to}, ${context.value}, ${context.nonce}, ${context.gasLimit}, ${context.gasUsed}, ${context.gasPrice}, ${context.data})'}
      ON CONFLICT (transfer_id)
      ${'DO UPDATE SET _block_timestamp = ${context.blockTimestamp}, _transaction_hash = ${context.transactionHash}'}`, args
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
