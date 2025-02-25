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
  dataDecoded: any[]
}

export class EventContextTable extends BaseDb {
  override async createTable () {
    await this.db.query(`CREATE TABLE IF NOT EXISTS event_context (
      id TEXT PRIMARY KEY,
      chain_id NUMERIC(78, 0) NOT NULL CHECK (chain_id >= 0), -- uint256
      transaction_hash CHAR(66) NOT NULL,
      transaction_index INTEGER NOT NULL CHECK (transaction_index >= 0),
      log_index INTEGER NOT NULL CHECK (log_index >= 0),
      block_number INTEGER NOT NULL CHECK (block_number >= 0),
      block_timestamp INTEGER NOT NULL CHECK (block_timestamp >= 0),
      from_address CHAR(42) NOT NULL,
      to_address CHAR(42) NOT NULL,
      value NUMERIC NOT NULL CHECK (value >= 0),
      nonce INTEGER NOT NULL CHECK (nonce >= 0),
      gas_limit INTEGER NOT NULL CHECK (gas_limit >= 0),
      gas_used INTEGER NOT NULL CHECK (gas_used >= 0),
      gas_price NUMERIC NOT NULL CHECK (gas_price >= 0),
      status INTEGER NOT NULL CHECK (status >= 0),
      data TEXT,
      data_ddcoded JSONB
    )`)
  }

  override async createIndexes () {
    await this.db.query(
      'CREATE UNIQUE INDEX IF NOT EXISTS idx_event_context_chain_id_tx_hash_log_index ON event_context (chain_id, transaction_hash, log_index);'
    )
    await this.db.query(
      'CREATE INDEX IF NOT EXISTS idx_event_context_chain_id ON event_context (chain_id);'
    )
    await this.db.query(
      'CREATE INDEX IF NOT EXISTS idx_event_context_tx_hash ON event_context (transaction_hash);'
    )
    await this.db.query(
      'CREATE INDEX IF NOT EXISTS idx_event_context_from_address ON event_context (from_address);'
    )
    await this.db.query(
      'CREATE INDEX IF NOT EXISTS idx_event_context_to_address ON event_context (to_address);'
    )
    await this.db.query(
      'CREATE INDEX IF NOT EXISTS idx_event_context_block_number ON event_context (block_number);'
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
        data,
        data_decoded AS "dataDecoded"
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
    const { chainId, transactionHash, transactionIndex, logIndex, blockNumber, blockTimestamp, from, to, value, nonce, gasLimit, gasUsed, gasPrice, status, data, dataDecoded } = this.#normalizeDataForPut(item)
    const args = {
      id: uuid(), chainId, transactionHash, transactionIndex, logIndex, blockNumber, blockTimestamp, from, to, value, nonce, gasLimit, gasUsed, gasPrice, status, data, dataDecoded
    }
    await this.db.query(
      `INSERT INTO
        event_context
      (
        id, chain_id, transaction_hash, transaction_index, log_index, block_number, block_timestamp, from_address, to_address, value, nonce, gas_limit, gas_used, gas_price, status, data, data_decoded
      )
      VALUES ${'(${id}, ${chainId}, ${transactionHash}, ${transactionIndex}, ${logIndex}, ${blockNumber}, ${blockTimestamp}, ${from}, ${to}, ${value}, ${nonce}, ${gasLimit}, ${gasUsed}, ${gasPrice}, ${status}, ${data}, ${dataDecoded})'}
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
