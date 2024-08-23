import { BaseType, EventDb } from '../BaseType.js'
import { BigNumber } from 'ethers'
import { getItemsWithContext, selectEventContextSql, eventContextIdCreationSql, getInsertEventContextSqlData } from '../context.js'
import { v4 as uuid } from 'uuid'

export interface HopStruct {
  pathId: string
  maxTotalSent: BigNumber
  attestedClaimId: string
}

export interface TransferSent extends BaseType {
  transferId: string
  to: string
  amount: BigNumber
  totalSent: BigNumber
  attestedClaimId: string
  attestedTotalClaims: BigNumber
  nextHops: HopStruct[]
}

export class TransferSentTable extends EventDb {
  override async createTable () {
    await this.db.query(`CREATE TABLE IF NOT EXISTS transfer_sent_events (
        id TEXT PRIMARY KEY,
        transfer_id CHAR(66) NOT NULL UNIQUE,
        "to" CHAR(42) NOT NULL, -- Ethereum address
        amount NUMERIC NOT NULL CHECK (amount >= 0),
        attested_claim_id CHAR(66) NOT NULL,
        attested_total_claims NUMERIC NOT NULL CHECK (attested_total_claims >= 0),
        ${eventContextIdCreationSql}
    )`)

    await this.db.query(`CREATE TABLE IF NOT EXISTS next_hops (
      id TEXT PRIMARY KEY,
      transfer_sent_event_id TEXT REFERENCES transfer_sent_events(id) ON DELETE CASCADE,
      path_id CHAR(66) NOT NULL,
      max_total_sent NUMERIC NOT NULL CHECK (max_total_sent >= 0),
      attested_claim_id CHAR(66) NOT NULL
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
    } else if (filter?.transactionHash) {
      args.push(filter.transactionHash)
    } else if (filter?.account) {
      args.push(filter.account)
    } else if (filter?.recipient) {
      args.push(filter.recipient)
    }

    const items = await this.db.any(
      `SELECT
        e.transfer_id AS "transferId",
        e."to",
        e.amount,
        e.total_sent AS "totalSent",
        e.attested_claim_id AS "attestedClaimId",
        e.attested_total_claims AS "attestedTotalClaims",
        ${selectEventContextSql},
        nh.path_id AS "pathId",
        nh.max_total_sent AS "maxTotalSent",
        nh.attested_claim_id AS "nextHopAttestedClaimId"
      FROM
        transfer_sent_events e
      JOIN
        event_context ec ON e.event_context_id = ec.id
      LEFT OUTER JOIN
        next_hops nh ON e.id = nh.transfer_sent_event_id
      LEFT OUTER JOIN
        transfer_bonded_events tbe ON e.transfer_id = tbe.transfer_id
      WHERE
        ec.block_timestamp >= $1
        AND
        ec.block_timestamp <= $2
        ${filter?.transferId ? 'AND e.transfer_id= $5' : ''}
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

    const results = getItemsWithContext(items)
    // Aggregate nextHops back into an array
    const itemsWithHops = this.#aggregateHops(results)
    return itemsWithHops
  }

  override async upsertItem (item: any) {
    const { transferId, to, amount, totalSent, attestedClaimId, attestedTotalClaims, context, nextHops } = this.#normalizeDataForPut(item)
    const {
      contextId,
      insertEventContextArgs,
      insertEventContextSql
    } = getInsertEventContextSqlData(context)
    const args = {
      id: uuid(), contextId, transferId, to, amount, totalSent, attestedClaimId, attestedTotalClaims
    }
    const sql = `
      INSERT INTO
        transfer_sent_events
      (
        id, event_context_id, transfer_id, "to", amount, total_sent, attested_claim_id, attested_total_claims
      )
      VALUES ${'(${id}, ${contextId}, ${transferId}, ${to}, ${amount}, ${totalSent}, ${attestedClaimId}, ${attestedTotalClaims})'}
      ON CONFLICT (transfer_id)
      ${'DO UPDATE SET transfer_id = ${transferId}'}
    `

    await this.db.tx(async (t: any) => {
      await t.none(insertEventContextSql, insertEventContextArgs)
      await t.none(sql, args)

      if (nextHops && nextHops.length > 0) {
        for (const hop of nextHops) {
          const hopArgs = {
            id: uuid(),
            pathId: hop.pathId,
            maxTotalSent: hop.maxTotalSent.toString(),
            attestedClaimId: hop.attestedClaimId
          }
          const hopSql = `
            INSERT INTO next_hops
            (
              id, transfer_sent_event_id, path_id, max_total_sent, attested_claim_id
            )
            VALUES ${'(${hopArgs.id}, ${hopArgs.pathId}, ${hopArgs.maxTotalSent}, ${hopArgs.attestedClaimId})'}
          `
          await t.none(hopSql, hopArgs)
        }
      }
    })
  }

  #aggregateHops(results: any[]) {
    const map = new Map()

    for (const item of results) {
      if (!map.has(item.transferId)) {
        map.set(item.transferId, { ...item, nextHops: [] })
      }

      if (item.pathId) {
        const hop = {
          pathId: item.pathId,
          maxTotalSent: BigNumber.from(item.maxTotalSent),
          attestedClaimId: item.nextHopAttestedClaimId
        }
        map.get(item.transferId).nextHops.push(hop)
      }
    }

    return Array.from(map.values())
  }

  #normalizeDataForGet (getData: Partial<TransferSent>): Partial<TransferSent> {
    if (!getData) {
      return getData
    }
    const data = Object.assign({}, getData)
    if (data.amount && typeof data.amount === 'string') {
      data.amount = BigNumber.from(data.amount)
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
    if (data.totalSent && typeof data.totalSent !== 'string') {
      data.totalSent = data.totalSent.toString()
    }
    if (data.attestedTotalClaims && typeof data.attestedTotalClaims !== 'string') {
      data.attestedTotalClaims = data.attestedTotalClaims.toString()
    }

    return data
  }
}
