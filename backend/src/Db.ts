import { v4 as uuid } from 'uuid'
import { dbPath } from './config'
const sqlite3 = require('sqlite3').verbose()

console.log('db path:', dbPath)

class Db {
  db = new sqlite3.Database(dbPath)

  constructor () {
    this.db.serialize(() => {
      const resetDb = true
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
          amount_out_min TEXT NOT NULL,
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

  async getTransfers () {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT id, chain, token, amount, amount_usd, timestamp FROM transfers;',
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

export default Db
