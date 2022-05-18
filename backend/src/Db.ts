import { v4 as uuid } from 'uuid'
import { dbPath } from './config'
const sqlite3 = require('sqlite3').verbose()

console.log('db path:', dbPath)

class Db {
  db = new sqlite3.Database(dbPath)

  constructor () {
    this.db.serialize(() => {
      const resetDb = false
      if (resetDb) {
        this.db.run('DROP TABLE IF EXISTS transfers')
      }
      this.db.run(`CREATE TABLE IF NOT EXISTS transfers (
          id TEXT PRIMARY KEY,
          transfer_id TEXT NOT NULL,
          transfer_id_truncated TEXT NOT NULL,
          transaction_hash TEXT NOT NULL,
          transaction_hash_truncated TEXT NOT NULL,
          transaction_hash_explorer_url TEXT NOT NULL,
          source_chain_id INTEGER NOT NULL,
          source_chain_slug TEXT NOT NULL,
          source_chain_name TEXT NOT NULL,
          source_chain_image_url TEXT NOT NULL,
          destination_chain_id INTEGER NOT NULL,
          destination_chain_slug TEXT NOT NULL,
          destination_chain_name TEXT NOT NULL,
          destination_chain_image_url TEXT NOT NULL,
          amount TEXT NOT NULL,
          amount_formatted NUMERIC NOT NULL,
          amount_display TEXT NOT NULL,
          amount_usd NUMERIC NOT NULL,
          amount_usd_display TEXT NOT NULL,
          amount_out_min TEXT,
          deadline INTEGER NOT NULL,
          recipient_address TEXT NOT NULL,
          recipient_address_truncated TEXT NOT NULL,
          recipient_address_explorer_url TEXT NOT NULL,
          bonder_fee TEXT NOT NULL,
          bonder_fee_formatted NUMERIC NOT NULL,
          bonder_fee_display TEXT NOT NULL,
          bonder_fee_usd NUMERIC NOT NULL,
          bonder_fee_usd_display TEXT NOT NULL,
          bonded BOOLEAN,
          bond_timestamp INTEGER,
          bond_timestamp_iso TEXT,
          bond_within_timestamp INTEGER,
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
          timestamp INTEGER NOT NULL,
          timestamp_iso TEXT NOT NULL
      )`)
      this.db.run(`CREATE TABLE IF NOT EXISTS token_prices (
          id TEXT PRIMARY KEY,
          token TEXT NOT NULL,
          price NUMERIC NOT NULL,
          timestamp INTEGER NOT NULL
      )`)

      this.db.run(
        'CREATE UNIQUE INDEX IF NOT EXISTS idx_transfers_transfer_id ON transfers (transfer_id);'
      )
      this.db.run(
        'CREATE UNIQUE INDEX IF NOT EXISTS idx_transfers_chain_token_timestamp ON transfers (source_chain_id, destination_chain_id, token, amount, timestamp);'
      )
      this.db.run(
        'CREATE UNIQUE INDEX IF NOT EXISTS idx_token_prices_token_timestamp ON token_prices (token, timestamp);'
      )
    })
  }

  async getPrices () {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT id, token, price, timestamp FROM token_prices;',
        (err: any, rows: any[]) => {
          if (err) {
            reject(err)
            return
          }
          resolve(rows)
        }
      )
    })
  }

  async upsertPrice (token: string, price: number, timestamp: number) {
    const stmt = this.db.prepare(
      'INSERT OR REPLACE INTO token_prices VALUES (?, ?, ?, ?)'
    )
    stmt.run(uuid(), token, price, timestamp)
    stmt.finalize()
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
    timestampIso: string
  ) {
    const stmt = this.db.prepare(
      'INSERT OR REPLACE INTO transfers VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    )
    stmt.run(
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
      timestampIso
    )
    stmt.finalize()
  }

  async getTransfers (params: any) {
    const {
      page,
      perPage,
      sourceChainSlug,
      destinationChainSlug,
      token,
      bonded,
      bonderAddress,
      amountFormatted,
      amountFormattedCmp,
      amountUsd,
      amountUsdCmp
    } = params
    const count = perPage
    const skip = (page * perPage)

    const queryParams = []
    const whereClauses = []

    const cmps: any = {
      gt: '>',
      gte: '>=',
      lt: '<',
      lte: '<=',
      eq: '='
    }

    // const [filterDate, setFilterDate] = useState(queryParams.date || currentDate)
    // const [filterTransferId, setFilterTransferId] = useState(queryParams.transferId || '')
    // const [filterAccount, setFilterAccount] = useState(queryParams.account || '')

    if (sourceChainSlug) {
      whereClauses.push('source_chain_slug = ?')
      queryParams.push(sourceChainSlug)
    }

    if (destinationChainSlug) {
      whereClauses.push('destination_chain_slug = ?')
      queryParams.push(destinationChainSlug)
    }

    if (token) {
      whereClauses.push('token = ?')
      queryParams.push(token)
    }

    if (typeof bonded === 'boolean') {
      if (bonded) {
        whereClauses.push('bonded = ?')
        queryParams.push(bonded)
      } else {
        whereClauses.push('(bonded = ? OR bonded IS NULL)')
        queryParams.push(bonded)
      }
    }

    // TODO: normalize
    if (bonderAddress) {
      whereClauses.push('bonder_address = ?')
      queryParams.push(bonderAddress)
    }

    if (amountFormatted) {
      const cmp = cmps[amountFormattedCmp]
      if (cmp) {
        whereClauses.push(`amount_formatted ${cmp} ?`)
        queryParams.push(amountFormatted)
      }
    }

    if (amountUsd) {
      const cmp = cmps[amountUsdCmp]
      if (cmp) {
        whereClauses.push(`amount_usd ${cmp} ?`)
        queryParams.push(amountUsd)
      }
    }

    const whereClause = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : ''
    queryParams.push(count, skip)

    const sql = `
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
          timestamp_iso AS "timestampIso"
        FROM
          transfers
        ${whereClause}
        ORDER BY
          timestamp
        DESC
        LIMIT
          ?
        OFFSET
          ?
        `

    return new Promise((resolve, reject) => {
      this.db.all(
        sql,
        queryParams,
        function (err: any, rows: any[]) {
          if (err) {
            reject(err)
            return
          }
          resolve(rows)
        }
      )
    })
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
