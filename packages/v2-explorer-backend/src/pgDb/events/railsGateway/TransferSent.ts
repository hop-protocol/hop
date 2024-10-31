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
  amountOut: BigNumber
  totalSent: BigNumber
  totalClaims: BigNumber
  hops: HopStruct[]
}

export class TransferSentTable extends EventDb {
  override async createTable () {
    await this.db.query(`CREATE TABLE IF NOT EXISTS transfer_sent_events (
        id TEXT PRIMARY KEY,
        path_id CHAR(66) NOT NULL,
        transfer_id CHAR(66) NOT NULL UNIQUE,
        "to" CHAR(42) NOT NULL, -- Ethereum address
        amount_out NUMERIC NOT NULL CHECK (amount_out >= 0),
        total_sent NUMERIC NOT NULL CHECK (total_sent >= 0),
        total_claims NUMERIC NOT NULL CHECK (total_claims >= 0),
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
      `SELECT
        e.path_id AS "pathId",
        e.transfer_id AS "transferId",
        e."to",
        e.amount_out AS "amountOut",
        e.total_sent AS "totalSent",
        e.total_claims AS "totalClaims",
        ${selectEventContextSql},
        nh.index,
        nh.path_id AS "nhPathId",
        nh.max_bonder_fee AS "maxBonderFee",
        nh.max_total_sent AS "maxTotalSent",
        nh.attested_claim_id AS "nhAttestedClaimId"
      FROM
        transfer_sent_events e
      JOIN
        event_context ec ON e.event_context_id = ec.id
      LEFT OUTER JOIN
        next_hops nh ON e.id = nh.transfer_sent_event_id
      LEFT OUTER JOIN
        transfer_bonded_events tbe ON e.transfer_id = tbe.claim_id
      WHERE
        ec.block_timestamp >= $1
        AND
        ec.block_timestamp <= $2
        ${filter?.transferId ? 'AND e.transfer_id = $5' : ''}
        ${filter?.attestedClaimId ? 'AND nh.attested_claim_id = $5' : ''}
        ${filter?.transactionHash ? 'AND ec.transaction_hash = $5' : ''}
        ${filter?.account ? 'AND ec.from_address = $5' : ''}
        ${filter?.recipient ? 'AND e."to" = $5' : ''}
        ${filter?.bonded != null ? 'AND tbe.claim_id IS NOT NULL' : ''}
        ${filter?.pending != null ? 'AND tbe.claim_id IS NULL' : ''}
        ${filter?.pathId != null ? 'AND nh.path_id = $5' : ''}
        ${filter?.eventChainId ? 'AND ec.chain_id = $5' : ''}
      ORDER BY
        ec.block_timestamp
      DESC
      LIMIT $3
      OFFSET $4`,
      args)

    const results = getItemsWithContext(items)
    console.log('rows',  results.length)

    // Aggregate hops back into an array
    const itemsWithHops = this.#aggregateHops(results)
    return itemsWithHops.map(item => this.#normalizeDataForGet(item))
  }

  override async upsertItem (item: any) {
    const { pathId, transferId, to, amountOut, totalSent, totalClaims, context, hops } = this.#normalizeDataForPut(item)
    const {
      contextId,
      insertEventContextArgs,
      insertEventContextSql
    } = getInsertEventContextSqlData(context)
    const args = {
      id: uuid(), contextId, pathId, transferId, to, amountOut, totalSent, totalClaims
    }
    const sql = `
      INSERT INTO
        transfer_sent_events
      (
        id, event_context_id, path_id, transfer_id, "to", amount_out, total_sent, total_claims
      )
      VALUES ${'(${id}, ${contextId}, ${pathId}, ${transferId}, ${to}, ${amountOut}, ${totalSent}, ${totalClaims})'}
      ON CONFLICT (transfer_id)
      ${'DO UPDATE SET path_id = ${pathId}, transfer_id = ${transferId}, "to" = ${to}, amount_out = ${amountOut}, total_sent = ${totalSent}, total_claims = ${totalClaims}'}
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
    delete (data as any).maxTotalSent
    delete (data as any).nhAttestedClaimId

    if (data.amountOut && typeof data.amountOut === 'string') {
      data.amountOut = BigNumber.from(data.amountOut)
    }
    if (data.totalSent && typeof data.totalSent === 'string') {
      data.totalSent = BigNumber.from(data.totalSent)
    }
    if (data.totalClaims && typeof data.totalClaims === 'string') {
      data.totalClaims = BigNumber.from(data.totalClaims)
    }
    return data
  }

  #normalizeDataForPut (putData: Partial<TransferSent>): Partial<TransferSent> {
    const data = Object.assign({}, putData) as any
    if (data.amountOut && typeof data.amountOut !== 'string') {
      data.amountOut = data.amountOut.toString()
    }
    if (data.totalSent && typeof data.totalSent !== 'string') {
      data.totalSent = data.totalSent.toString()
    }
    if (data.totalClaims && typeof data.totalClaims !== 'string') {
      data.totalClaims = data.totalClaims.toString()
    }

    return data
  }
}
