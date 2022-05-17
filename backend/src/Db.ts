import { v4 as uuid } from 'uuid'
import { dbPath } from './config'
const sqlite3 = require('sqlite3').verbose()

console.log('db path:', dbPath)

class Db {
  db = new sqlite3.Database(dbPath)

  constructor () {
    this.db.serialize(() => {
      this.db.run(`CREATE TABLE IF NOT EXISTS transfers (
          id TEXT PRIMARY KEY,
          chain TEXT NOT NULL,
          token TEXT NOT NULL,
          amount NUMERIC NOT NULL,
          amount_usd NUMERIC NOT NULL,
          timestamp INTEGER NOT NULL
      )`)
      this.db.run(`CREATE TABLE IF NOT EXISTS token_prices (
          id TEXT PRIMARY KEY,
          token TEXT NOT NULL,
          price NUMERIC NOT NULL,
          timestamp INTEGER NOT NULL
      )`)

      this.db.run(
        'CREATE UNIQUE INDEX IF NOT EXISTS idx_transfers_chain_token_timestamp ON transfers (chain, token, timestamp);'
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

  async getPrice (token: string, price: number, timestamp: number) {
    this.db.each(
      'SELECT id, token, price, timestamp FROM token_prices;', (err: any, row: any) => {
        if (err) {
          console.error(err)
          return
        }
        console.log(row.id + ': ' + row.token, row.price, row.timestamp)
      }
    )
  }

  async upsertPrice (token: string, price: number, timestamp: number) {
    const stmt = this.db.prepare(
      'INSERT OR REPLACE INTO token_prices VALUES (?, ?, ?, ?)'
    )
    stmt.run(uuid(), token, price, timestamp)
    stmt.finalize()
  }

  async upsertTransfer (
    chain: string,
    token: string,
    amount: number,
    amountUsd: number,
    timestamp: number
  ) {
    const stmt = this.db.prepare(
      'INSERT OR REPLACE INTO transfers VALUES (?, ?, ?, ?, ?, ?)'
    )
    stmt.run(uuid(), chain, token, amount, amountUsd, timestamp)
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
