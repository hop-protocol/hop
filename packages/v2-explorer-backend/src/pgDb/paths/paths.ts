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
        path_id VARCHAR NOT NULL UNIQUE,
        chain_id NUMERIC NOT NULL,
        token VARCHAR NOT NULL,
        counterpart_token VARCHAR NOT NULL,
        counterpart_chain_id NUMERIC NOT NULL
    )`)
  }

  override async createIndexes () {
    await this.db.query(
      'CREATE UNIQUE INDEX IF NOT EXISTS idx_paths_path_id ON paths (path_id);'
    )
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

    const items = await this.db.any(
      `SELECT
        path_id AS "pathId",
        chain_id AS "chainId",
        token,
        counterpart_token AS "counterpartToken",
        counterpart_chain_id AS "counterpartChainId"
      FROM
        paths
      ${filter?.pathId ? 'WHERE path_id = $3' : ''}
      ORDER BY
        chain_id
      DESC
      LIMIT $1
      OFFSET $2`,
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
      ON CONFLICT (path_id)
      ${'DO UPDATE SET chain_id = ${chainId}'}`, args
    )
  }

  #normalizeDataForGet (getData: Partial<Path>): Partial<Path> {
    if (!getData) {
      return getData
    }
    const data = Object.assign({}, getData)
    return data
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
