const sqlite3 = require('sqlite3').verbose()
import { v4 as uuid } from 'uuid'
import { dbPath } from './config'

console.log('db path:', dbPath)

const argv = require('minimist')(process.argv.slice(2))

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
      if (argv.resetBonderBalancesDb) {
        this.db.run(`DROP TABLE IF EXISTS bonder_balances`)
      }
      // TODO: track by bonder address
      this.db.run(`CREATE TABLE IF NOT EXISTS bonder_balances (
          id TEXT PRIMARY KEY,
          token TEXT NOT NULL,
          polygon_block_number INTEGER,
          polygon_canonical_amount NUMERIC,
          polygon_hToken_amount NUMERIC,
          polygon_native_amount NUMERIC,
          gnosis_block_number INTEGER,
          gnosis_canonical_amount NUMERIC,
          gnosis_hToken_amount NUMERIC,
          gnosis_native_amount NUMERIC,
          arbitrum_block_number INTEGER,
          arbitrum_canonical_amount NUMERIC,
          arbitrum_hToken_amount NUMERIC,
          arbitrum_native_amount NUMERIC,
          arbitrum_alias_amount NUMERIC,
          optimism_block_number INTEGER,
          optimism_canonical_amount NUMERIC,
          optimism_hToken_amount NUMERIC,
          optimism_native_amount NUMERIC,
          ethereum_block_number INTEGER NOT NULL,
          ethereum_canonical_amount NUMERIC NOT NULL,
          ethereum_native_amount NUMERIC NOT NULL,
          unstaked_amount NUMERIC NOT NULL,
          restaked_amount NUMERIC NOT NULL,
          eth_price_usd NUMERIC NOT NULL,
          matic_price_usd NUMERIC NOT NULL,
          result NUMERIC NOT NULL,
          timestamp INTEGER NOT NULL
      )`)
      if (argv.resetBonderFeesDb) {
        this.db.run(`DROP TABLE IF EXISTS bonder_fees`)
      }
      // TODO: track by bonder address
      this.db.run(`CREATE TABLE IF NOT EXISTS bonder_fees(
          id TEXT PRIMARY KEY,
          token TEXT NOT NULL,
          polygon_fees_amount NUMERIC NOT NULL,
          gnosis_fees_amount NUMERIC NOT NULL,
          arbitrum_fees_amount NUMERIC NOT NULL,
          optimism_fees_amount NUMERIC NOT NULL,
          ethereum_fees_amount NUMERIC NOT NULL,
          total_fees_amount NUMERIC NOT NULL,
          timestamp INTEGER NOT NULL
      )`)
      if (argv.resetBonderTxFeesDb) {
        this.db.run(`DROP TABLE IF EXISTS bonder_tx_fees`)
      }
      // TODO: track by bonder address
      this.db.run(`CREATE TABLE IF NOT EXISTS bonder_tx_fees(
          id TEXT PRIMARY KEY,
          token TEXT NOT NULL,
          polygon_tx_fees NUMERIC NOT NULL,
          gnosis_tx_fees NUMERIC NOT NULL,
          arbitrum_tx_fees NUMERIC NOT NULL,
          optimism_tx_fees NUMERIC NOT NULL,
          ethereum_tx_fees NUMERIC NOT NULL,
          total_tx_fees NUMERIC NOT NULL,
          eth_price_usd NUMERIC NOT NULL,
          matic_price_usd NUMERIC NOT NULL,
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
      this.db.run(
        'CREATE UNIQUE INDEX IF NOT EXISTS idx_bonder_balances_token_timestamp ON bonder_balances (token, timestamp);'
      )
      this.db.run(
        'CREATE UNIQUE INDEX IF NOT EXISTS idx_bonder_tx_fees_token_timestamp ON bonder_tx_fees (token, timestamp);'
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

  async upsertBonderBalances (
    token: string,
    polygonBlockNumber: number,
    polygonCanonicalAmount: number = 0,
    polygonHTokenAmount: number = 0,
    polygonNativeAmount: number = 0,
    gnosisBlockNumber: number,
    gnosisCanonicalAmount: number = 0,
    gnosisHTokenAmount: number = 0,
    gnosisNativeAmount: number = 0,
    arbitrumBlockNumber: number,
    arbitrumCanonicalAmount: number = 0,
    arbitrumHTokenAmount: number = 0,
    arbitrumNativeAmount: number = 0,
    arbitrumAliasAmount: number = 0,
    optimismBlockNumber: number,
    optimismCanonicalAmount: number = 0,
    optimismHTokenAmount: number = 0,
    optimismNativeAmount: number = 0,
    ethereumBlockNumber: number,
    ethereumCanonicalAmount: number = 0,
    ethereumNativeAmount: number = 0,
    unstakedAmount: number = 0,
    restakedAmount: number = 0,
    ethPriceUsd: number,
    maticPriceUsd: number,
    result: number,
    timestamp: number
  ) {
    const stmt = this.db.prepare(
      'INSERT OR REPLACE INTO bonder_balances VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    )
    stmt.run(
      uuid(),
      token,
      polygonBlockNumber,
      polygonCanonicalAmount,
      polygonHTokenAmount,
      polygonNativeAmount,
      gnosisBlockNumber,
      gnosisCanonicalAmount,
      gnosisHTokenAmount,
      gnosisNativeAmount,
      arbitrumBlockNumber,
      arbitrumCanonicalAmount,
      arbitrumHTokenAmount,
      arbitrumNativeAmount,
      arbitrumAliasAmount,
      optimismBlockNumber,
      optimismCanonicalAmount,
      optimismHTokenAmount,
      optimismNativeAmount,
      ethereumBlockNumber,
      ethereumCanonicalAmount,
      ethereumNativeAmount,
      unstakedAmount,
      restakedAmount,
      ethPriceUsd,
      maticPriceUsd,
      result,
      timestamp
    )
    stmt.finalize()
  }

  async upsertBonderFees (
    token: string,
    polygonFees: number = 0,
    gnosisFees: number = 0,
    arbitrumFees: number = 0,
    optimismFees: number = 0,
    ethereumFees: number = 0,
    totalFees: number = 0,
    timestamp: number = 0
  ) {
    const stmt = this.db.prepare(
      'INSERT OR REPLACE INTO bonder_fees VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    )
    stmt.run(
      uuid(),
      token,
      token,
      polygonFees,
      gnosisFees,
      arbitrumFees,
      optimismFees,
      totalFees,
      timestamp
    )
    stmt.finalize()
  }

  async upsertBonderTxFees (
    token: string,
    polygonTxFees: number = 0,
    gnosisTxFees: number = 0,
    arbitrumTxFees: number = 0,
    optimismTxFees: number = 0,
    ethereumTxFees: number = 0,
    totalFees: number = 0,
    ethPriceUsd: number = 0,
    maticPriceUsd: number = 0,
    timestamp: number = 0
  ) {
    const stmt = this.db.prepare(
      'INSERT OR REPLACE INTO bonder_tx_fees VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    )
    stmt.run(
      uuid(),
      token,
      polygonTxFees,
      gnosisTxFees,
      arbitrumTxFees,
      optimismTxFees,
      ethereumTxFees,
      totalFees,
      ethPriceUsd,
      maticPriceUsd,
      timestamp
    )
    stmt.finalize()
  }

  close () {
    this.db.close()
  }
}

export default Db
