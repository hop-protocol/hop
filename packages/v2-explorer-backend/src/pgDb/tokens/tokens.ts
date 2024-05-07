import { BaseDb } from '../events/BaseType.js'
import { v4 as uuid } from 'uuid'

export interface Token {
  chainId: string
  address: string
  name: string
  symbol: string
  decimals: number
}

export class TokenTable extends BaseDb {
  override async createTable () {
    await this.db.query(`CREATE TABLE IF NOT EXISTS tokens (
        id TEXT PRIMARY KEY,
        chain_id VARCHAR NOT NULL,
        address VARCHAR NOT NULL,
        name VARCHAR NOT NULL,
        symbol VARCHAR NOT NULL,
        decimals INTEGER NOT NULL
    )`)
  }

  override async createIndexes () {
    await this.db.query(
      'CREATE UNIQUE INDEX IF NOT EXISTS idx_tokens_chain_id_address ON tokens (chain_id, address);'
    )
  }

  override async getItems (opts: any = {}) {
    const { limit = 10, page = 1, filter } = opts
    let offset = (page - 1) * limit
    if (offset < 0) {
      offset = 0
    }

    const args = [limit, offset]
    if (filter?.address) {
      args.push(filter.address)
    }
    if (filter?.chainId) {
      args.push(filter.chainId)
    }

    const items = await this.db.any(
      `SELECT
        chain_id AS "chainId",
        address,
        name,
        symbol,
        decimals
      FROM
        tokens
      ${filter?.address ? 'WHERE address = $3' : ''}
      ${filter?.chainId ? 'AND chain_id = $4' : ''}
      ORDER BY
        symbol
      DESC
      LIMIT $1
      OFFSET $2`,
      args)

    return items
  }

  override async upsertItem (item: any) {
    const { chainId, address, name, symbol, decimals } = this.#normalizeDataForPut(item)
    const args = {
      id: uuid(), chainId, address, name, symbol, decimals
    }
    await this.db.query(
      `INSERT INTO
        tokens
      (
        id, chain_id, address, name, symbol, decimals
      )
      VALUES ${'(${id}, ${chainId}, ${address}, ${name}, ${symbol}, ${decimals})'}
      ON CONFLICT (chain_id, address)
      ${'DO UPDATE SET chain_id = ${chainId}, name = ${name}, symbol = ${symbol}, decimals = ${decimals}'}`, args
    )
  }

  #normalizeDataForGet (getData: Partial<Token>): Partial<Token> {
    if (!getData) {
      return getData
    }
    const data = Object.assign({}, getData)
    return data
  }

  #normalizeDataForPut (putData: Partial<Token>): Partial<Token> {
    const data = Object.assign({}, putData) as any

    if (data.chainId && typeof data.chainId !== 'string') {
      data.chainId = data.chainId.toString()
    }

    return data
  }
}
