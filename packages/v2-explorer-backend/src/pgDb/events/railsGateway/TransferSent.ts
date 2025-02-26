import { BaseType, EventDb } from '../BaseType.js'
import { BigNumber } from 'ethers'
import { getItemsWithContext, selectEventContextSql, eventContextIdCreationSql, getInsertEventContextSqlData } from '../context.js'
import { v4 as uuid } from 'uuid'

export interface HopStruct {
  index?: number
  pathId: string
  maxBonderFee: BigNumber
  maxTotalSent: BigNumber
  attestedClaimId: string
}

export interface TransferSent extends BaseType {
  pathId: string
  transferId: string
  to: string
  amount: BigNumber
  sourcePool: BigNumber
  hops: HopStruct[]
}

type VolumeStatsInput = {
  startTimestamp?: number
  endTimestamp?: number
}

type VolumeStatsResult = {
  tokenSymbol: string
  tokenDecimals: number
  totalVolume: string
}

export class TransferSentTable extends EventDb {
  override async createTable () {
    await this.db.query(`CREATE TABLE IF NOT EXISTS transfer_sent_events (
        id TEXT PRIMARY KEY,
        path_id CHAR(66) NOT NULL,
        transfer_id CHAR(66) NOT NULL UNIQUE,
        "to" CHAR(42) NOT NULL, -- Ethereum address
        amount NUMERIC NOT NULL CHECK (amount >= 0),
        source_pool NUMERIC NOT NULL CHECK (source_pool >= 0),
        ${eventContextIdCreationSql}
    )`)

    await this.db.query(`CREATE TABLE IF NOT EXISTS next_hops (
      id TEXT PRIMARY KEY,
      transfer_sent_event_id TEXT REFERENCES transfer_sent_events(id) ON DELETE CASCADE,
      "index" INTEGER NOT NULL CHECK ("index" >= 0),
      path_id CHAR(66) NOT NULL,
      max_bonder_fee  NUMERIC NOT NULL CHECK (max_bonder_fee >= 0),
      max_total_sent NUMERIC NOT NULL CHECK (max_total_sent >= 0),
      attested_claim_id CHAR(66) NOT NULL
    )`)
  }

  override async createIndexes () {
    await this.db.query(
      'CREATE UNIQUE INDEX IF NOT EXISTS idx_transfer_sent_events_transfer_id ON transfer_sent_events (transfer_id);'
    )
    await this.db.query(
      'CREATE INDEX IF NOT EXISTS idx_transfer_sent_events_to ON transfer_sent_events ("to");'
    )
    await this.db.query(
      'CREATE INDEX IF NOT EXISTS idx_transfer_sent_events_event_context_id ON transfer_sent_events (event_context_id);'
    )
    await this.db.query(
      'CREATE INDEX IF NOT EXISTS idx_next_hops_path_id ON next_hops (path_id);'
    )
    await this.db.query(
      'CREATE INDEX IF NOT EXISTS idx_transfer_sent_events_event_path_id ON transfer_sent_events (path_id);'
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
    } else if (filter?.transactionHash) {
      args.push(filter.transactionHash)
    } else if (filter?.account) {
      args.push(filter.account)
    } else if (filter?.recipient) {
      args.push(filter.recipient)
    } else if (filter?.attestedClaimId) {
      args.push(filter.attestedClaimId)
    } else if (filter?.pathId) {
      args.push(filter.pathId)
    } else if (filter?.eventChainId) {
      args.push(filter.eventChainId)
    }

    const items = await this.db.any(
      `WITH filtered_transfers AS (
        SELECT
          e.id,
          e.path_id AS "pathId",
          e.transfer_id AS "transferId",
          e."to",
          e.amount AS "amount",
          e.source_pool AS "sourcePool",
          ${selectEventContextSql}
        FROM
          transfer_sent_events e
        JOIN
          event_context ec ON e.event_context_id = ec.id
        LEFT OUTER JOIN
          transfer_bonded_events tbe ON e.transfer_id = tbe.claim_id
        WHERE
          ec.block_timestamp >= $1
          AND ec.block_timestamp <= $2
          ${filter?.transferId ? 'AND e.transfer_id = $5' : ''}
          ${filter?.transactionHash ? 'AND ec.transaction_hash = $5' : ''}
          ${filter?.account ? 'AND ec.from_address = $5' : ''}
          ${filter?.recipient ? 'AND e."to" = $5' : ''}
          ${filter?.bonded != null ? 'AND tbe.claim_id IS NOT NULL' : ''}
          ${filter?.pending != null ? 'AND tbe.claim_id IS NULL' : ''}
          ${filter?.eventChainId ? 'AND ec.chain_id = $5' : ''}
          ${filter?.attestedClaimId ? 'AND EXISTS (SELECT 1 FROM next_hops nh WHERE nh.transfer_sent_event_id = e.id AND nh.attested_claim_id = $5)' : ''}
          ${filter?.pathId != null ? 'AND EXISTS (SELECT 1 FROM next_hops nh WHERE nh.transfer_sent_event_id = e.id AND nh.path_id = $5)' : ''}
        ORDER BY
          ec.block_timestamp DESC
        LIMIT $3
        OFFSET $4
      )
      SELECT
        ft.*,
        nh.index,
        nh.path_id AS "nhPathId",
        nh.max_bonder_fee AS "maxBonderFee",
        nh.max_total_sent AS "maxTotalSent",
        nh.attested_claim_id AS "nhAttestedClaimId"
      FROM
        filtered_transfers ft
      LEFT OUTER JOIN
        next_hops nh ON ft.id = nh.transfer_sent_event_id
      ORDER BY
        ft."context.blockTimestamp" DESC`,
      args)

    const results = getItemsWithContext(items)
    console.log('TransferSent rows',  results.length)

    // Aggregate hops back into an array
    const itemsWithHops = this.#aggregateHops(results)
    const normalizedItems = itemsWithHops.map(item => this.#normalizeDataForGet(item))
    console.log('TransferSent itemsWithHops', normalizedItems.length)

    return normalizedItems
  }

  override async upsertItem (item: any) {
    const { pathId, transferId, to, amount, sourcePool, context, hops } = this.#normalizeDataForPut(item)
    const {
      contextId,
      insertEventContextArgs,
      insertEventContextSql
    } = getInsertEventContextSqlData(context)
    const args = {
      id: uuid(), contextId, pathId, transferId, to, amount, sourcePool
    }
    const sql = `
      INSERT INTO
        transfer_sent_events
      (
        id, event_context_id, path_id, transfer_id, "to", amount, source_pool
      )
      VALUES ${'(${id}, ${contextId}, ${pathId}, ${transferId}, ${to}, ${amount}, ${sourcePool})'}
      ON CONFLICT (transfer_id)
      ${'DO UPDATE SET path_id = ${pathId}, transfer_id = ${transferId}, "to" = ${to}, amount = ${amount}, source_pool = ${sourcePool}'}
      RETURNING id;
    `

    await this.db.tx(async (t: any) => {
      await t.none(insertEventContextSql, insertEventContextArgs)
      const result = await t.one(sql, args)
      const transferSentEventId = result.id // Retrieve the inserted/updated id

      // Delete existing hops for the current transferSentEventId
      const deleteSql = `DELETE FROM next_hops WHERE transfer_sent_event_id = $1`
      await t.none(deleteSql, [transferSentEventId])
      console.log('hops', hops, transferSentEventId)

      if (hops && hops.length > 0) {
        let i = 0
        for (const hop of hops) {
          const hopArgs = {
            id: uuid(),
            index: i,
            transferSentEventId,
            pathId: hop.pathId,
            maxBonderFee: hop.maxBonderFee.toString(),
            maxTotalSent: hop.maxTotalSent.toString(),
            attestedClaimId: hop.attestedClaimId
          }
          const hopSql = `
            INSERT INTO next_hops
            (
              id, transfer_sent_event_id, "index", path_id, max_bonder_fee, max_total_sent, attested_claim_id
            )
            VALUES ${'(${id}, ${transferSentEventId}, ${index}, ${pathId}, ${maxBonderFee}, ${maxTotalSent}, ${attestedClaimId})'}
          `
          await t.none(hopSql, hopArgs)
          i++
        }
      }
    })
  }

  #aggregateHops(results: any[]) {
    const map = new Map()

    for (const item of results) {
      if (!map.has(item.transferId)) {
        map.set(item.transferId, { ...item, hops: [] })
      }

      if (item.pathId) {
        const hop = {
          index: item.index,
          pathId: item.nhPathId,
          maxBonderFee: BigNumber.from(item.maxBonderFee ?? 0),
          maxTotalSent: BigNumber.from(item.maxTotalSent),
          attestedClaimId: item.nhAttestedClaimId
        }
        map.get(item.transferId).hops.push(hop)
      }
    }

    return Array.from(map.values()).map(item => {
      // Sort hops within each item based on index
      item.hops.sort((a: any, b: any) => a.index - b.index)
      return this.#normalizeHopStructDataForGet(item)
    })
  }

  #normalizeHopStructDataForGet (getData: Partial<HopStruct>): Partial<HopStruct> {
    if (!getData) {
      return getData
    }
    const data = Object.assign({}, getData)
    if (data.maxBonderFee && typeof data.maxBonderFee === 'string') {
      data.maxBonderFee = BigNumber.from(data.maxBonderFee)
    }
    if (data.maxTotalSent && typeof data.maxTotalSent === 'string') {
      data.maxTotalSent = BigNumber.from(data.maxTotalSent)
    }
    return data
  }

  #normalizeDataForGet (getData: Partial<TransferSent>): Partial<TransferSent> {
    if (!getData) {
      return getData
    }
    const data = Object.assign({}, getData)

    // delete next hops fields
    delete (data as any).index
    delete (data as any).nhPathId
    delete (data as any).maxBonderFee
    delete (data as any).maxTotalSent
    delete (data as any).nhAttestedClaimId

    if (data.amount && typeof data.amount === 'string') {
      data.amount = BigNumber.from(data.amount)
    }

    if (data.sourcePool && typeof data.sourcePool === 'string') {
      data.sourcePool = BigNumber.from(data.sourcePool)
    }

    return data
  }

  #normalizeDataForPut (putData: Partial<TransferSent>): Partial<TransferSent> {
    const data = Object.assign({}, putData) as any
    if (data.amount && typeof data.amount !== 'string') {
      data.amount = data.amount.toString()
    }
    if (data.sourcePool && typeof data.sourcePool !== 'string') {
      data.sourcePool = data.sourcePool.toString()
    }

    return data
  }

  async getVolumeStats(opts: VolumeStatsInput = {}): Promise<VolumeStatsResult> {
    const { startTimestamp = 0, endTimestamp = Math.floor(Date.now() / 1000) } = opts

    const args = [startTimestamp, endTimestamp]

    const query = `
      SELECT
        t.symbol AS "tokenSymbol",
        t.decimals AS "tokenDecimals",
        SUM(e.amount) AS "totalVolume"
      FROM
        transfer_sent_events e
      JOIN
        event_context ec ON e.event_context_id = ec.id
      JOIN
        paths p ON e.path_id = p.path_id
      JOIN
        tokens t ON p.token = t.address
      WHERE
        ec.block_timestamp >= $1
        AND ec.block_timestamp <= $2
      GROUP BY
        t.symbol, t.decimals
    `

    const results = await this.db.any(query, args)
    return results
  }
}
