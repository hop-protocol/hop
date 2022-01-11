const sqlite3 = require('sqlite3').verbose()
import { v4 as uuid } from 'uuid'
import { dbPath } from './config'

console.log('db path:', dbPath)

class Db {
  db = new sqlite3.Database(dbPath)

  constructor () {
    this.db.serialize(() => {
      this.db.run(`CREATE TABLE IF NOT EXISTS volume_stats (
          id TEXT PRIMARY KEY,
          chain TEXT NOT NULL,
          token TEXT NOT NULL,
          amount NUMERIC NOT NULL,
          amount_usd NUMERIC NOT NULL,
          timestamp INTEGER NOT NULL
      )`)
      this.db.run(`CREATE TABLE IF NOT EXISTS tvl_pool_stats (
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
        'CREATE UNIQUE INDEX IF NOT EXISTS idx_volume_stats_chain_token_timestamp ON volume_stats (chain, token, timestamp);'
      )
      this.db.run(
        'CREATE UNIQUE INDEX IF NOT EXISTS idx_tvl_pool_stats_chain_token_timestamp ON tvl_pool_stats (chain, token, timestamp);'
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
      'SELECT id, token, price, timestamp FROM token_prices;',
      function (err: any, row: any) {
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

  async upsertVolumeStat (
    chain: string,
    token: string,
    amount: number,
    amountUsd: number,
    timestamp: number
  ) {
    const stmt = this.db.prepare(
      'INSERT OR REPLACE INTO volume_stats VALUES (?, ?, ?, ?, ?, ?)'
    )
    stmt.run(uuid(), chain, token, amount, amountUsd, timestamp)
    stmt.finalize()
  }

  async upsertTvlPoolStat (
    chain: string,
    token: string,
    amount: number,
    amountUsd: number,
    timestamp: number
  ) {
    const stmt = this.db.prepare(
      'INSERT OR REPLACE INTO tvl_pool_stats VALUES (?, ?, ?, ?, ?, ?)'
    )
    stmt.run(uuid(), chain, token, amount, amountUsd, timestamp)
    stmt.finalize()
  }

  async getVolumeStats () {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT id, chain, token, amount, amount_usd, timestamp FROM volume_stats;',
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
