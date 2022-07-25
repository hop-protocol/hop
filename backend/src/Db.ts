import pgp from 'pg-promise'
import { v4 as uuid } from 'uuid'
import { postgresConfig } from './config'

const argv = require('minimist')(process.argv.slice(2))

class Db {
  db: any

  constructor () {
    const initOptions: any = {}
    const maxConnections = postgresConfig.maxConnections
    const opts = {
      max: maxConnections
    }

    const db = pgp(initOptions)({ ...postgresConfig, ...opts })
    this.db = db
    this.init().catch(console.error).then(() => {
      console.log('db init done')
    })
  }

  async init () {
    const resetDb = argv.reset
    if (resetDb) {
      await this.db.query('DROP TABLE IF EXISTS transfers')
    }

    const migration = argv.migration
    if (migration) {
      await this.db.query(`
        ALTER TABLE transfers ADD COLUMN IF NOT EXISTS preregenesis BOOLEAN
      `)
      await this.db.query(`
        ALTER TABLE transfers ADD COLUMN IF NOT EXISTS account_address_truncated TEXT
      `)
      await this.db.query(`
        ALTER TABLE transfers ADD COLUMN IF NOT EXISTS account_address_explorer_url TEXT
      `)
      await this.db.query(`
        ALTER TABLE transfers ADD COLUMN IF NOT EXISTS received_htokens BOOLEAN
      `)
    }

    await this.db.query(`CREATE TABLE IF NOT EXISTS transfers (
        id TEXT PRIMARY KEY,
        transfer_id TEXT NOT NULL,
        transfer_id_truncated TEXT NOT NULL,
        transaction_hash TEXT NOT NULL,
        transaction_hash_truncated TEXT NOT NULL,
        transaction_hash_explorer_url TEXT NOT NULL,
        source_chain_id NUMERIC NOT NULL,
        source_chain_slug TEXT NOT NULL,
        source_chain_name TEXT NOT NULL,
        source_chain_image_url TEXT NOT NULL,
        destination_chain_id NUMERIC NOT NULL,
        destination_chain_slug TEXT NOT NULL,
        destination_chain_name TEXT NOT NULL,
        destination_chain_image_url TEXT NOT NULL,
        account_address TEXT NOT NULL,
        account_address_truncated TEXT NOT NULL,
        account_address_explorer_url TEXT NOT NULL,
        amount TEXT NOT NULL,
        amount_formatted NUMERIC NOT NULL,
        amount_display TEXT NOT NULL,
        amount_usd NUMERIC NOT NULL,
        amount_usd_display TEXT NOT NULL,
        amount_out_min TEXT,
        deadline NUMERIC NOT NULL,
        recipient_address TEXT NOT NULL,
        recipient_address_truncated TEXT NOT NULL,
        recipient_address_explorer_url TEXT NOT NULL,
        bonder_fee TEXT NOT NULL,
        bonder_fee_formatted NUMERIC NOT NULL,
        bonder_fee_display TEXT NOT NULL,
        bonder_fee_usd NUMERIC NOT NULL,
        bonder_fee_usd_display TEXT NOT NULL,
        bonded BOOLEAN,
        bond_timestamp NUMERIC,
        bond_timestamp_iso TEXT,
        bond_within_timestamp NUMERIC,
        bond_within_timestamp_relative TEXT,
        bond_transaction_hash TEXT,
        bond_transaction_hash_truncated TEXT,
        bond_transaction_hash_explorer_url TEXT,
        bonder_address TEXT,
        bonder_address_truncated TEXT,
        bonder_address_explorer_url TEXT,
        token TEXT NOT NULL,
        token_image_url TEXT NOT NULL,
        token_price_usd NUMERIC NOT NULL,
        token_price_usd_display TEXT NOT NULL,
        timestamp NUMERIC NOT NULL,
        timestamp_iso TEXT NOT NULL,
        preregenesis BOOLEAN,
        recieved_htokens BOOLEAN
    )`)

    await this.db.query(`CREATE TABLE IF NOT EXISTS token_prices (
        id TEXT PRIMARY KEY,
        token TEXT NOT NULL,
        price NUMERIC NOT NULL,
        timestamp INTEGER NOT NULL
    )`)

    await this.db.query(
      'CREATE UNIQUE INDEX IF NOT EXISTS idx_transfers_transfer_id ON transfers (transfer_id);'
    )

    await this.db.query(
      'DROP INDEX IF EXISTS idx_transfers_chain_token_timestamp;'
    )

    await this.db.query(
      'CREATE INDEX IF NOT EXISTS idx_transfers_transaction_hash ON transfers (transaction_hash);'
    )

    await this.db.query(
      'CREATE INDEX IF NOT EXISTS idx_transfers_account_address ON transfers (account_address);'
    )

    await this.db.query(
      'CREATE INDEX IF NOT EXISTS idx_transfers_bonder_address ON transfers (bonder_address);'
    )

    await this.db.query(
      'CREATE INDEX IF NOT EXISTS idx_transfers_recipient_address ON transfers (recipient_address);'
    )

    await this.db.query(
      'CREATE INDEX IF NOT EXISTS idx_transfers_token ON transfers (token);'
    )

    await this.db.query(
      'CREATE INDEX IF NOT EXISTS idx_transfers_source_chain_slug ON transfers (source_chain_slug);'
    )

    await this.db.query(
      'CREATE INDEX IF NOT EXISTS idx_transfers_destination_chain_slug ON transfers (destination_chain_slug);'
    )

    await this.db.query(
      'CREATE INDEX IF NOT EXISTS idx_transfers_bonded ON transfers (bonded);'
    )

    await this.db.query(
      'CREATE UNIQUE INDEX IF NOT EXISTS idx_token_prices_token_timestamp ON token_prices (token, timestamp);'
    )
  }

  async getPrices () {
    return this.db.any(
      'SELECT id, token, price, timestamp FROM token_prices'
    )
  }

  async upsertPrice (token: string, price: number, timestamp: number) {
    const args = [uuid(), token, price, timestamp]
    await this.db.query(
      'INSERT INTO token_prices (id, token, price, timestamp) VALUES ($1, $2, $3, $4) ON CONFLICT (token, timestamp) DO UPDATE SET price = $3', args
    )
  }

  async upsertTransfer (
    transferId: string,
    transferIdTruncated: string,
    transactionHash: string,
    transactionHashTruncated: string,
    transactionHashExplorerUrl: string,
    sourceChainId: number,
    sourceChainSlug: string,
    sourceChainName: string,
    sourceChainImageUrl: string,
    destinationChainId: number,
    destinationChainSlug: string,
    destinationChainName: string,
    destinationChainImageUrl: string,
    accountAddress: string,
    accountAddressTruncated: string,
    accountAddressExplorerUrl: string,
    amount: string,
    amountFormatted: number,
    amountDisplay: string,
    amountUsd: number,
    amountUsdDisplay: string,
    amountOutMin: string,
    deadline: number,
    recipientAddress: string,
    recipientAddressTruncated: string,
    recipientAddressExplorerUrl: string,
    bonderFee: string,
    bonderFeeFormatted: number,
    bonderFeeDisplay: string,
    bonderFeeUsd: number,
    bonderFeeUsdDisplay: string,
    bonded: boolean,
    bondTimestamp: number,
    bondTimestampIso: string,
    bondWithinTimestamp: number,
    bondWithinTimestampRelative: string,
    bondTransactionHash: string,
    bondTransactionHashTruncated: string,
    bondTransactionHashExplorerUrl: string,
    bonderAddress: string,
    bonderAddressTruncated: string,
    bonderAddressExplorerUrl: string,
    token: string,
    tokenImageUrl: string,
    tokenPriceUsd: number,
    tokenPriceUsdDisplay: string,
    timestamp: number,
    timestampIso: string,
    preregenesis: boolean,
    receivedHTokens: boolean
  ) {
    const args = [
      transferId,
      transferId,
      transferIdTruncated,
      transactionHash,
      transactionHashTruncated,
      transactionHashExplorerUrl,
      sourceChainId,
      sourceChainSlug,
      sourceChainName,
      sourceChainImageUrl,
      destinationChainId,
      destinationChainSlug,
      destinationChainName,
      destinationChainImageUrl,
      accountAddress,
      accountAddressTruncated,
      accountAddressExplorerUrl,
      amount,
      amountFormatted,
      amountDisplay,
      amountUsd,
      amountUsdDisplay,
      amountOutMin,
      deadline,
      recipientAddress,
      recipientAddressTruncated,
      recipientAddressExplorerUrl,
      bonderFee,
      bonderFeeFormatted,
      bonderFeeDisplay,
      bonderFeeUsd,
      bonderFeeUsdDisplay,
      bonded,
      bondTimestamp,
      bondTimestampIso,
      bondWithinTimestamp,
      bondWithinTimestampRelative,
      bondTransactionHash,
      bondTransactionHashTruncated,
      bondTransactionHashExplorerUrl,
      bonderAddress,
      bonderAddressTruncated,
      bonderAddressExplorerUrl,
      token,
      tokenImageUrl,
      tokenPriceUsd,
      tokenPriceUsdDisplay,
      timestamp,
      timestampIso,
      preregenesis,
      receivedHTokens
    ]
    await this.db.query(
      `INSERT INTO transfers (
        id,
        transfer_id,
        transfer_id_truncated,
        transaction_hash,
        transaction_hash_truncated,
        transaction_hash_explorer_url,
        source_chain_id,
        source_chain_slug,
        source_chain_name,
        source_chain_image_url,
        destination_chain_id,
        destination_chain_slug,
        destination_chain_name,
        destination_chain_image_url,
        account_address,
        account_address_truncated,
        account_address_explorer_url,
        amount,
        amount_formatted,
        amount_display,
        amount_usd,
        amount_usd_display,
        amount_out_min,
        deadline,
        recipient_address,
        recipient_address_truncated,
        recipient_address_explorer_url,
        bonder_fee,
        bonder_fee_formatted,
        bonder_fee_display,
        bonder_fee_usd,
        bonder_fee_usd_display,
        bonded,
        bond_timestamp,
        bond_timestamp_iso,
        bond_within_timestamp,
        bond_within_timestamp_relative,
        bond_transaction_hash,
        bond_transaction_hash_truncated,
        bond_transaction_hash_explorer_url,
        bonder_address,
        bonder_address_truncated,
        bonder_address_explorer_url,
        token,
        token_image_url,
        token_price_usd,
        token_price_usd_display,
        timestamp,
        timestamp_iso,
        preregenesis,
        received_htokens
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47, $48, $49, $50, $51) ON CONFLICT (
      transfer_id
      ) DO UPDATE SET
        id = $1,
        transfer_id = $2,
        transfer_id_truncated = $3,
        transaction_hash = $4,
        transaction_hash_truncated = $5,
        transaction_hash_explorer_url = $6,
        source_chain_id = $7,
        source_chain_slug = $8,
        source_chain_name = $9,
        source_chain_image_url = $10,
        destination_chain_id = $11,
        destination_chain_slug = $12,
        destination_chain_name = $13,
        destination_chain_image_url = $14,
        account_address = $15,
        account_address_truncated = $16,
        account_address_explorer_url = $17,
        amount = $18,
        amount_formatted = $19,
        amount_display = $20,
        amount_usd = $21,
        amount_usd_display = $22,
        amount_out_min = $23,
        deadline = $24,
        recipient_address = $25,
        recipient_address_truncated = $26,
        recipient_address_explorer_url = $27,
        bonder_fee = $28,
        bonder_fee_formatted = $29,
        bonder_fee_display = $30,
        bonder_fee_usd = $31,
        bonder_fee_usd_display = $32,
        bonded = $33,
        bond_timestamp = $34,
        bond_timestamp_iso = $35,
        bond_within_timestamp = $36,
        bond_within_timestamp_relative = $37,
        bond_transaction_hash = $38,
        bond_transaction_hash_truncated = $39,
        bond_transaction_hash_explorer_url = $40,
        bonder_address = $41,
        bonder_address_truncated = $42,
        bonder_address_explorer_url = $43,
        token = $44,
        token_image_url = $45,
        token_price_usd = $46,
        token_price_usd_display = $47,
        timestamp = $48,
        timestamp_iso = $49,
        preregenesis = $50,
        received_htokens = $51
      `, args
    )
  }

  async getTransfers (params: any) {
    const {
      page = 0,
      perPage = 10,
      sourceChainSlug,
      destinationChainSlug,
      token,
      bonded,
      bonderAddress,
      accountAddress,
      recipientAddress,
      amountFormatted,
      amountFormattedCmp,
      amountUsd,
      amountUsdCmp,
      bonderFeeUsd,
      bonderFeeUsdCmp,
      transferId,
      startTimestamp,
      endTimestamp,
      countOnly,
      receivedHTokens
    } = params
    let count = perPage
    let skip = (page * perPage)

    if (count < 0) {
      count = 0
    }

    if (skip < 0) {
      skip = 0
    }

    const queryParams = []
    const whereClauses = []

    const sortDirection = params.sortDirection ? params.sortDirection?.toUpperCase() : 'DESC'
    const sortBy = params.sortBy || 'timestamp'

    let i = 1
    if (!countOnly) {
      queryParams.push(count, skip)
      i = 3
    }

    const cmps: any = {
      gt: '>',
      gte: '>=',
      lt: '<',
      lte: '<=',
      eq: '='
    }

    if (bonderAddress) {
      whereClauses.push(`bonder_address = $${i++}`)
      queryParams.push(bonderAddress.toLowerCase())
    }

    if (accountAddress) {
      whereClauses.push(`account_address = $${i++}`)
      queryParams.push(accountAddress.toLowerCase())
    }

    if (recipientAddress) {
      whereClauses.push(`recipient_address = $${i++}`)
      queryParams.push(recipientAddress.toLowerCase())
    }

    if (transferId) {
      whereClauses.push(`(transfer_id = $${i} OR transaction_hash = $${i})`)
      queryParams.push(transferId)
      i++
    }

    if (sourceChainSlug) {
      whereClauses.push(`source_chain_slug = $${i++}`)
      queryParams.push(sourceChainSlug)
    }

    if (destinationChainSlug) {
      whereClauses.push(`destination_chain_slug = $${i++}`)
      queryParams.push(destinationChainSlug)
    }

    if (token) {
      whereClauses.push(`token = $${i++}`)
      queryParams.push(token)
    }

    if (typeof bonded === 'boolean') {
      if (bonded) {
        whereClauses.push(`bonded = $${i++}`)
        queryParams.push(bonded)
      } else {
        whereClauses.push(`(bonded = $${i++} OR bonded IS NULL)`)
        queryParams.push(bonded)
      }
    }

    if (amountFormatted) {
      const cmp = cmps[amountFormattedCmp]
      if (cmp) {
        whereClauses.push(`amount_formatted ${cmp} $${i++}`)
        queryParams.push(amountFormatted)
      }
    }

    if (amountUsd) {
      const cmp = cmps[amountUsdCmp]
      if (cmp) {
        whereClauses.push(`amount_usd ${cmp} $${i++}`)
        queryParams.push(amountUsd)
      }
    }

    if (bonderFeeUsd) {
      const cmp = cmps[bonderFeeUsdCmp]
      if (cmp) {
        whereClauses.push(`bonder_fee_usd ${cmp} $${i++}`)
        queryParams.push(bonderFeeUsd)
      }
    }

    if (receivedHTokens !== undefined) {
      if (receivedHTokens === null) {
        whereClauses.push('received_htokens IS NULL')
      } else {
        whereClauses.push(`received_htokens = $${i++}`)
        queryParams.push(receivedHTokens)
      }
    }

    if (!(transferId || accountAddress || recipientAddress || bonderAddress)) {
      if (startTimestamp) {
        whereClauses.push(`timestamp >= $${i++}`)
        queryParams.push(startTimestamp)
      }

      if (endTimestamp) {
        whereClauses.push(`timestamp <= $${i++}`)
        queryParams.push(endTimestamp)
      }
    }

    const whereClause = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : ''

    let sql = `
        SELECT
          id,
          transfer_id AS "transferId",
          transfer_id_truncated AS "transferIdTruncated",
          transaction_hash AS "transactionHash",
          transaction_hash_truncated AS "transactionHashTruncated",
          transaction_hash_explorer_url AS "transactionHashExplorerUrl",
          source_chain_id AS "sourceChainId",
          source_chain_slug AS "sourceChainSlug",
          source_chain_name AS "sourceChainName",
          source_chain_image_url AS "sourceChainImageUrl",
          destination_chain_id AS "destinationChainId",
          destination_chain_slug AS "destinationChainSlug",
          destination_chain_name AS "destinationChainName",
          destination_chain_image_url AS "destinationChainImageUrl",
          account_address AS "accountAddress",
          account_address_truncated AS "accountAddressTruncated",
          account_address_explorer_url AS "accountAddressExplorerUrl",
          amount,
          amount_formatted AS "amountFormatted",
          amount_display AS "amountDisplay",
          amount_usd AS "amountUsd",
          amount_usd_display AS "amountUsdDisplay",
          amount_out_min AS "amountOutMin",
          deadline,
          recipient_address AS "recipientAddress",
          recipient_address_truncated AS "recipientAddressTruncated",
          recipient_address_explorer_url AS "recipientAddressExplorerUrl",
          bonder_fee AS "bonderFee",
          bonder_fee_formatted AS "bonderFeeFormatted",
          bonder_fee_display AS "bonderFeeDisplay",
          bonder_fee_usd AS "bonderFeeUsd",
          bonder_fee_usd_display AS "bonderFeeUsdDisplay",
          bonded,
          bond_timestamp AS "bondTimestamp",
          bond_timestamp_iso AS "bondTimestampIso",
          bond_within_timestamp AS "bondWithinTimestamp",
          bond_within_timestamp_relative AS "bondWithinTimestampRelative",
          bond_transaction_hash AS "bondTransactionHash",
          bond_transaction_hash_truncated AS "bondTransactionHashTruncated",
          bond_transaction_hash_explorer_url AS "bondTransactionHashExplorerUrl",
          bonder_address AS "bonderAddress",
          bonder_address_truncated AS "bonderAddressTruncated",
          bonder_address_explorer_url AS "bonderAddressExplorerUrl",
          token,
          token_image_url AS "tokenImageUrl",
          token_price_usd AS "tokenPriceUsd",
          token_price_usd_display AS "tokenPriceUsdDisplay",
          timestamp,
          timestamp_iso AS "timestampIso",
          preregenesis,
          received_htokens AS "receivedHTokens"
        FROM
          transfers
        ${whereClause}
        ORDER BY
          ${sortBy}
        ${sortDirection}
        LIMIT
          $1
        OFFSET
          $2
        `

    if (countOnly) {
      sql = `
        SELECT
          COUNT(*) AS "count"
        FROM
          transfers
        ${whereClause}
        `
    }

    return this.db.any(sql, queryParams)
  }

  close () {
    this.db.close()
  }
}

let instance :any

export function getInstance () {
  if (!instance) {
    instance = new Db()
  }
  return instance
}

export default Db
