import { BaseDb } from '../events/BaseType.js'
import { v4 as uuid } from 'uuid'

export interface Path {
  pathId: string
  chainId: string
  token: string
  counterpartToken: string
  counterpartChainId: string
}

export class PathTable extends BaseDb {
  override async createTable () {
    await this.db.query(`CREATE TABLE IF NOT EXISTS paths (
        id TEXT PRIMARY KEY,
        path_id VARCHAR NOT NULL,
        chain_id NUMERIC NOT NULL,
        token VARCHAR NOT NULL,
        counterpart_token VARCHAR NOT NULL,
        counterpart_chain_id NUMERIC NOT NULL
    )`)
  }

  override async createIndexes () {
    await this.db.query('CREATE UNIQUE INDEX IF NOT EXISTS idx_paths_path_id_chain_id ON paths (path_id, chain_id);')
    await this.db.query('CREATE INDEX IF NOT EXISTS idx_paths_path_id ON paths (path_id);')
    await this.db.query('CREATE INDEX IF NOT EXISTS idx_paths_chain_id ON paths (chain_id);')
    await this.db.query('CREATE INDEX IF NOT EXISTS idx_paths_token ON paths (token);')
    await this.db.query('CREATE INDEX IF NOT EXISTS idx_paths_counterpart_token ON paths (counterpart_token);')
    await this.db.query('CREATE INDEX IF NOT EXISTS idx_paths_counterpart_chain_id ON paths (counterpart_chain_id);')
  }

  override async getItems (opts: any = {}) {
    const { limit = 10, page = 1, filter } = opts
    let offset = (page - 1) * limit
    if (offset < 0) {
      offset = 0
    }

    const args = [limit, offset]
    if (filter?.pathId) {
      args.push(filter.pathId)
    }
    if (filter?.chainId) {
      args.push(filter.chainId?.toString())
    }
    if (filter?.token) {
      args.push(filter.token)
    }
    if (filter?.counterpartToken) {
      args.push(filter.counterpartToken)
    }
    if (filter?.counterpartChainId) {
      args.push(filter.counterpartChainId)
    }

    const items = await this.db.any(`
      SELECT
        p.path_id AS "pathId",
        p.chain_id::VARCHAR AS "chainId",          -- Cast chain_id to VARCHAR
        p.token,
        COALESCE(t1.name, '') AS "tokenName",      -- Use COALESCE to return an empty string if there's no match
        COALESCE(t1.symbol, '') AS "tokenSymbol",
        COALESCE(t1.decimals, 0) AS "tokenDecimals",
        p.counterpart_token AS "counterpartToken",
        COALESCE(t2.name, '') AS "counterpartTokenName",
        COALESCE(t2.symbol, '') AS "counterpartTokenSymbol",
        COALESCE(t2.decimals, 0) AS "counterpartTokenDecimals",
        p.counterpart_chain_id::VARCHAR AS "counterpartChainId"  -- Cast counterpart_chain_id to VARCHAR
      FROM
        paths p
      LEFT JOIN
        tokens t1 ON p.chain_id::VARCHAR = t1.chain_id AND p.token = t1.address
      LEFT JOIN
        tokens t2 ON p.counterpart_chain_id::VARCHAR = t2.chain_id AND p.counterpart_token = t2.address
      WHERE
        1 = 1
        ${filter?.pathId ? 'AND p.path_id = $3' : ''}
        ${filter?.token ? 'AND p.token = $3' : ''}
        ${filter?.counterpartToken ? 'AND p.counterpart_token = $3' : ''}
        ${filter?.chainId ? `AND p.chain_id::VARCHAR = ${filter?.pathId ? '$4' : '$3'}` : ''}
        ${filter?.counterpartChainId ? 'AND p.counterpart_chain_id::VARCHAR = $3' : ''}
      ORDER BY
        p.chain_id
      DESC
      LIMIT $1
      OFFSET $2
      `,
      args)

    return items
  }

  override async upsertItem (item: any) {
    const { pathId, chainId, token, counterpartToken, counterpartChainId } = this.#normalizeDataForPut(item)
    const args = {
      id: uuid(), pathId, chainId, token, counterpartToken, counterpartChainId
    }
    await this.db.query(
      `INSERT INTO
        paths
      (
        id, path_id, chain_id, token, counterpart_token, counterpart_chain_id
      )
      VALUES ${'(${id}, ${pathId}, ${chainId}, ${token}, ${counterpartToken}, ${counterpartChainId})'}
      ON CONFLICT (path_id, chain_id)
      ${'DO UPDATE SET path_id = ${pathId}, chain_id = ${chainId}, token = ${token}, counterpart_token = ${counterpartToken}, counterpart_chain_id = ${counterpartChainId}'}`, args
    )
  }

  #normalizeDataForPut (putData: Partial<Path>): Partial<Path> {
    const data = Object.assign({}, putData) as any

    if (data.chainId && typeof data.chainId !== 'string') {
      data.chainId = data.chainId.toString()
    }

    if (data.counterpartChainId && typeof data.counterpartChainId !== 'string') {
      data.counterpartChainId = data.counterpartChainId.toString()
    }

    return data
  }
}
