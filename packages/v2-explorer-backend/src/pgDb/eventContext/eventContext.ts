import { BaseDb } from '../events/BaseType.js'
import { v4 as uuid } from 'uuid'

export interface EventContext {
  chainId: string
  transactionHash: string
  transactionIndex: number
  logIndex: number
  blockNumber: number
  blockTimestamp: number
  from: string
  to: string
  value: string
  nonce: number
  gasLimit: number
  gasUsed: number
  gasPrice: string
  status: number
  data: string
}

export class EventContextTable extends BaseDb {
  override async createTable () {
    await this.db.query(`CREATE TABLE IF NOT EXISTS event_context (
        id TEXT PRIMARY KEY,
        chain_id VARCHAR,
        transaction_hash VARCHAR,
        transaction_index INTEGER,
        log_index INTEGER,
        block_number INTEGER,
        block_timestamp INTEGER,
        from_address VARCHAR,
        to_address VARCHAR,
        value VARCHAR,
        nonce INTEGER,
        gas_limit INTEGER,
        gas_used INTEGER,
        gas_price NUMERIC,
        status INTEGER,
        data VARCHAR
    )`)
  }

  override async createIndexes () {
    await this.db.query(
      'CREATE UNIQUE INDEX IF NOT EXISTS idx_event_context_chain_id_tx_hash_log_index ON event_context (chain_id, transaction_hash, log_index);'
    )
  }

  override async getItems (opts: any = {}) {
    const { limit = 10, page = 1, filter } = opts
    let offset = (page - 1) * limit
    if (offset < 0) {
      offset = 0
    }

    const args = [limit, offset]
    if (filter?.chainId) {
      args.push(filter.chainId)
    }
    if (filter?.transactionHash) {
      args.push(filter.transactionHash)
    }
    if (filter?.fromAddress) {
      args.push(filter.fromAddress)
    }

    const items = await this.db.any(
      `SELECT
        chain_id AS "chainId",
        transaction_hash AS "transactionHash",
        transaction_index AS "transactionIndex",
        log_index AS "logIndex",
        block_number AS "blockNumber",
        block_timestamp AS "blockTimestamp",
        from_address AS "fromAddress",
        to_address AS "toAddress",
        value,
        nonce,
        gas_limit AS "gasLimit",
        gas_used AS "gasUsed",
        gas_price AS "gasPrice",
        status,
        data
      FROM
        event_context
      WHERE
        1 = 1
        ${filter?.chainId ? 'AND chain_id = $3' : ''}
        ${filter?.transactionHash ? 'AND transaction_hash = $4' : ''}
        ${filter?.fromAddress ? 'AND from_address = $5' : ''}
      ORDER BY
        block_timestamp
      DESC
      LIMIT $1
      OFFSET $2`,
      args)

    return items
  }

  override async upsertItem (item: any) {
    const { chainId, transactionHash, transactionIndex, logIndex, blockNumber, blockTimestamp, from, to, value, nonce, gasLimit, gasUsed, gasPrice, status, data } = this.#normalizeDataForPut(item)
    const args = {
      id: uuid(), chainId, transactionHash, transactionIndex, logIndex, blockNumber, blockTimestamp, from, to, value, nonce, gasLimit, gasUsed, gasPrice, status, data
    }
    await this.db.query(
      `INSERT INTO
        event_context
      (
        id, chain_id, transaction_hash, transaction_index, log_index, block_number, block_timestamp, from_address, to_address, value, nonce, gas_limit, gas_used, gas_price, status, data
      )
      VALUES ${'(${id}, ${chainId}, ${transactionHash}, ${transactionIndex}, ${logIndex}, ${blockNumber}, ${blockTimestamp}, ${from}, ${to}, ${value}, ${nonce}, ${gasLimit}, ${gasUsed}, ${gasPrice}, ${status}, ${data})'}
      ON CONFLICT (transaction_hash)
      ${'DO UPDATE SET chain_id = ${chainId}, log_index = ${logIndex}'}`, args
    )
  }

  #normalizeDataForGet (getData: Partial<EventContext>): Partial<EventContext> {
    if (!getData) {
      return getData
    }
    const data = Object.assign({}, getData)
    return data
  }

  #normalizeDataForPut (putData: Partial<EventContext>): Partial<EventContext> {
    const data = Object.assign({}, putData) as any

    if (data.chainId && typeof data.chainId !== 'string') {
      data.chainId = data.chainId.toString()
    }

    return data
  }
}
