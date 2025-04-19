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
  totalVolumeFormatted: string
}

type DailyVolumeStatsInput = {
  startTimestamp?: number
  endTimestamp?: number
  days?: number
  pathId?: string
}

type DailyVolumeStatsResult = {
  date: string
  tokenSymbol: string
  tokenDecimals: number
  volume: string
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
          ${filter?.transferId ? 'AND e.transfer_id = $5' : (
            filter?.transactionHash ? 'AND ec.transaction_hash = $5' : ''
          )}
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
    
    // Add pagination-aware index to each item
    const normalizedItems = itemsWithHops.map((item, index) => {
      // Calculate the global index based on page number and limit
      const globalIndex = (page - 1) * limit + index + 1 // Adding 1 to make it 1-indexed
      return {
        ...item,
        i: globalIndex
      }
    })
    
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

  async getVolumeStats(opts: VolumeStatsInput = {}): Promise<VolumeStatsResult[]> {
    const { startTimestamp = 0, endTimestamp = Math.floor(Date.now() / 1000) } = opts

    const args = [startTimestamp, endTimestamp]

    // Use DISTINCT ON to ensure each transfer_id is only counted once
    const query = `
      WITH unique_transfers AS (
        SELECT DISTINCT ON (e.transfer_id)
          e.transfer_id,
          e.amount,
          t.symbol,
          t.decimals
        FROM transfer_sent_events e
        JOIN event_context ec ON e.event_context_id = ec.id
        JOIN paths p ON e.path_id = p.path_id
        JOIN tokens t ON p.token = t.address
        WHERE ec.block_timestamp >= $1
          AND ec.block_timestamp <= $2
        ORDER BY e.transfer_id, e.id
      )
      SELECT
        symbol AS "tokenSymbol",
        decimals AS "tokenDecimals",
        SUM(amount) AS "totalVolume"
      FROM unique_transfers
      GROUP BY symbol, decimals
    `

    const results = await this.db.any(query, args)
    
    // Add formatted total values
    return results.map((result: { tokenSymbol: string, tokenDecimals: string, totalVolume: string }) => {
      const decimals = parseInt(result.tokenDecimals)
      let formattedAmount = '0'
      
      if (decimals > 0 && result.totalVolume !== '0') {
        try {
          const valueStr = result.totalVolume.toString()
          
          if (valueStr.length <= decimals) {
            // If less than 1 token unit
            const fractionalPart = valueStr.padStart(decimals, '0')
            formattedAmount = `0.${fractionalPart}`
          } else {
            // Otherwise insert decimal point
            const integerPart = valueStr.slice(0, valueStr.length - decimals)
            const fractionalPart = valueStr.slice(valueStr.length - decimals)
            formattedAmount = `${integerPart}.${fractionalPart}`
          }
        } catch (err) {
          console.error('Error formatting amount in getVolumeStats', err)
        }
      }
      
      return {
        ...result,
        totalVolumeFormatted: formattedAmount
      }
    })
  }

  async getDailyVolumeStats(opts: DailyVolumeStatsInput = {}): Promise<DailyVolumeStatsResult[]> {
    // Get current timestamp in seconds
    const now = Math.floor(Date.now() / 1000)
    
    // Default to last 30 days if not specified
    const { days = 30, pathId } = opts
    const startTimestamp = opts.startTimestamp || now - (days * 86400) // 86400 seconds = 1 day
    const endTimestamp = opts.endTimestamp || now

    // Ensure endTimestamp doesn't exceed current time
    const safeEndTimestamp = Math.min(endTimestamp, now)
    
    // Log the date range we're querying with readable dates for debugging
    console.log(`Getting daily volume stats from ${new Date(startTimestamp * 1000).toISOString()} to ${new Date(safeEndTimestamp * 1000).toISOString()}`)

    const pathIdFilter = pathId ? `AND e.path_id = '${pathId}'` : ''
    const args = [startTimestamp, safeEndTimestamp]

    // Simplified query that ensures each transfer_id is only counted once
    const query = `
      WITH 
      -- Generate a series of dates covering the requested range
      date_series AS (
        SELECT generate_series(
          date_trunc('day', to_timestamp($1)),
          date_trunc('day', to_timestamp($2)),
          '1 day'::interval
        ) AS day_date
      ),
      -- Get all unique token symbols in use
      unique_tokens AS (
        SELECT DISTINCT t.symbol, t.decimals
        FROM tokens t
        JOIN paths p ON t.address = p.token
        JOIN transfer_sent_events e ON p.path_id = e.path_id
        JOIN event_context ec ON e.event_context_id = ec.id
        WHERE ec.block_timestamp >= $1
          AND ec.block_timestamp <= $2
          ${pathIdFilter}
      ),
      -- Create a cross product of all dates and tokens
      date_token_combinations AS (
        SELECT
          day_date,
          symbol,
          decimals
        FROM date_series
        CROSS JOIN unique_tokens
      ),
      -- First get a deduplicated set of transfers with their dates and token info
      unique_transfers AS (
        SELECT DISTINCT ON (e.transfer_id)
          e.transfer_id,
          e.amount,
          t.symbol,
          t.decimals,
          date_trunc('day', to_timestamp(ec.block_timestamp)) AS day_timestamp
        FROM transfer_sent_events e
        JOIN event_context ec ON e.event_context_id = ec.id
        JOIN paths p ON e.path_id = p.path_id
        JOIN tokens t ON p.token = t.address
        WHERE ec.block_timestamp >= $1
          AND ec.block_timestamp <= $2
          AND ec.block_timestamp <= ${now}
          ${pathIdFilter}
        ORDER BY e.transfer_id, e.id
      ),
      -- Sum the volumes by day and token
      daily_volumes AS (
        SELECT
          day_timestamp,
          symbol,
          decimals,
          SUM(amount) AS total_volume
        FROM unique_transfers
        GROUP BY day_timestamp, symbol, decimals
      )
      
      -- Join with date_token_combinations to ensure all dates are present
      SELECT
        to_char(dtc.day_date, 'YYYY-MM-DD') AS date,
        dtc.symbol AS "tokenSymbol",
        dtc.decimals AS "tokenDecimals",
        COALESCE(dv.total_volume, '0') AS volume
      FROM date_token_combinations dtc
      LEFT JOIN daily_volumes dv 
        ON dtc.day_date = dv.day_timestamp AND dtc.symbol = dv.symbol
      ORDER BY
        dtc.day_date ASC,
        dtc.symbol ASC
    `

    const results = await this.db.any(query, args)
    console.log(`Got ${results.length} daily volume results`)
    return results
  }

  async getCumulativeVolumeStats(opts: DailyVolumeStatsInput = {}): Promise<DailyVolumeStatsResult[]> {
    // Get current timestamp in seconds
    const now = Math.floor(Date.now() / 1000)
    
    // Default to last 30 days if not specified
    const { days = 30, pathId } = opts
    const startTimestamp = opts.startTimestamp || now - (days * 86400) // 86400 seconds = 1 day
    const endTimestamp = opts.endTimestamp || now

    // Ensure endTimestamp doesn't exceed current time
    const safeEndTimestamp = Math.min(endTimestamp, now)
    
    // Log the date range we're querying with readable dates for debugging
    console.log(`Getting cumulative volume stats from ${new Date(startTimestamp * 1000).toISOString()} to ${new Date(safeEndTimestamp * 1000).toISOString()}`)

    const pathIdFilter = pathId ? `AND e.path_id = '${pathId}'` : ''
    const args = [startTimestamp, safeEndTimestamp]

    // Simplified query that ensures each transfer_id is only counted once
    const query = `
      WITH 
      -- Generate a series of dates covering the requested range
      date_series AS (
        SELECT generate_series(
          date_trunc('day', to_timestamp($1)),
          date_trunc('day', to_timestamp($2)),
          '1 day'::interval
        ) AS day_date
      ),
      -- Get all unique token symbols in use
      unique_tokens AS (
        SELECT DISTINCT t.symbol, t.decimals
        FROM tokens t
        JOIN paths p ON t.address = p.token
        JOIN transfer_sent_events e ON p.path_id = e.path_id
        JOIN event_context ec ON e.event_context_id = ec.id
        WHERE ec.block_timestamp >= $1
          AND ec.block_timestamp <= $2
          ${pathIdFilter}
      ),
      -- Create a cross product of all dates and tokens
      date_token_combinations AS (
        SELECT
          day_date,
          symbol,
          decimals
        FROM date_series
        CROSS JOIN unique_tokens
      ),
      -- First get a deduplicated set of transfers with their dates and token info
      unique_transfers AS (
        SELECT DISTINCT ON (e.transfer_id)
          e.transfer_id,
          e.amount,
          t.symbol,
          t.decimals,
          ec.block_timestamp,
          date_trunc('day', to_timestamp(ec.block_timestamp)) AS day_timestamp
        FROM transfer_sent_events e
        JOIN event_context ec ON e.event_context_id = ec.id
        JOIN paths p ON e.path_id = p.path_id
        JOIN tokens t ON p.token = t.address
        WHERE ec.block_timestamp >= $1
          AND ec.block_timestamp <= $2
          AND ec.block_timestamp <= ${now}
          ${pathIdFilter}
        ORDER BY e.transfer_id, e.id
      ),
      -- Calculate cumulative volume for each day and token
      cumulative_volumes AS (
        SELECT
          dt.day_date,
          dt.symbol,
          dt.decimals,
          SUM(CASE WHEN ut.day_timestamp <= dt.day_date THEN ut.amount ELSE 0 END) AS cumulative_volume
        FROM date_token_combinations dt
        CROSS JOIN unique_transfers ut
        WHERE dt.symbol = ut.symbol  -- Join on matching token symbols
        GROUP BY dt.day_date, dt.symbol, dt.decimals
      )
      
      -- Format the results
      SELECT
        to_char(dtc.day_date, 'YYYY-MM-DD') AS date,
        dtc.symbol AS "tokenSymbol",
        dtc.decimals AS "tokenDecimals",
        COALESCE(cv.cumulative_volume, '0') AS volume
      FROM date_token_combinations dtc
      LEFT JOIN cumulative_volumes cv
        ON dtc.day_date = cv.day_date AND dtc.symbol = cv.symbol
      ORDER BY
        dtc.day_date ASC,
        dtc.symbol ASC
    `

    const results = await this.db.any(query, args)
    console.log(`Got ${results.length} cumulative volume results`)
    return results
  }

  async getCumulativeTransferCounts(input: { days?: number } = {}) {
    const { days = 30 } = input
    const now = Math.floor(Date.now() / 1000)
    const startTimestamp = now - (days * 24 * 60 * 60)

    const query = `
      WITH daily_counts AS (
        SELECT 
          DATE_TRUNC('day', TO_TIMESTAMP(block_timestamp)) as date,
          COUNT(*) as count
        FROM transfer_sent_events e
        JOIN event_context ec ON e.event_context_id = ec.id
        WHERE ec.block_timestamp >= $1
        GROUP BY DATE_TRUNC('day', TO_TIMESTAMP(block_timestamp))
        ORDER BY date
      )
      SELECT 
        date,
        SUM(count) OVER (ORDER BY date) as count
      FROM daily_counts
      ORDER BY date
    `

    const result = await this.db.query(query, [startTimestamp])
    return result.map((row: any) => ({
      date: row.date.toISOString().split('T')[0],
      count: row.count.toString()
    }))
  }
}
