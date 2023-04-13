const sqlite3 = require('sqlite3').verbose()
import { v4 as uuid } from 'uuid'
import { dbPath } from './config'

console.log('db path:', dbPath)

const argv = require('minimist')(process.argv.slice(2))

let migrationRan = false

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
      this.db.run(`CREATE TABLE IF NOT EXISTS amm_stats (
          id TEXT PRIMARY KEY,
          chain TEXT NOT NULL,
          token TEXT NOT NULL,
          volume NUMERIC NOT NULL,
          volume_usd NUMERIC NOT NULL,
          fees NUMERIC NOT NULL,
          fees_usd NUMERIC NOT NULL,
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
          timestamp INTEGER NOT NULL,
          result2 NUMERIC,
          eth_amounts NUMERIC,
          xdai_price_usd NUMERIC,
          deposit_amount NUMERIC,
          staked_amount NUMERIC,
          initial_canonical_amount NUMERIC,
          result3 NUMERIC,
          arbitrum_weth_amount NUMERIC,
          withdrawn_amount NUMERIC,
          unstaked_eth_amount NUMERIC,
          bonder_address TEXT NOT NULL,
          deposit_event TEXT,
          restaked_eth_amount NUMERIC,
          initial_eth_amount NUMERIC,
          initial_matic_amount NUMERIC,
          initial_xdai_amount NUMERIC,
          withdraw_event TEXT,
          arbitrum_messenger_wrapper_amount NUMERIC,
          nova_block_number INTEGER,
          nova_canonical_amount NUMERIC,
          nova_hToken_amount NUMERIC,
          nova_native_amount NUMERIC
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
          timestamp INTEGER NOT NULL,
          xdai_price_usd NUMERIC NOT NULL
      )`)

      if (argv.migrations && !migrationRan) {
        const migrations = JSON.parse(argv.migrations)
        if (migrations.includes(0)) {
          this.db.run('ALTER TABLE bonder_balances ADD COLUMN result2 NUMERIC;')
        }
        if (migrations.includes(1)) {
          this.db.run(
            'ALTER TABLE bonder_balances ADD COLUMN eth_amounts NUMERIC;'
          )
        }
        if (migrations.includes(2)) {
          this.db.run(
            'ALTER TABLE bonder_balances ADD COLUMN xdai_price_usd NUMERIC;'
          )
        }
        if (migrations.includes(3)) {
          this.db.run(
            'ALTER TABLE bonder_tx_fees ADD COLUMN xdai_price_usd NUMERIC;'
          )
        }
        if (migrations.includes(4)) {
          this.db.run(
            'ALTER TABLE bonder_balances ADD COLUMN deposit_amount NUMERIC;'
          )
        }
        if (migrations.includes(5)) {
          this.db.run(
            'ALTER TABLE bonder_balances ADD COLUMN staked_amount NUMERIC;'
          )
        }
        if (migrations.includes(6)) {
          this.db.run(
            'ALTER TABLE bonder_balances ADD COLUMN initial_canonical_amount NUMERIC;'
          )
        }
        if (migrations.includes(7)) {
          this.db.run('ALTER TABLE bonder_balances ADD COLUMN result3 NUMERIC;')
        }
        if (migrations.includes(8)) {
          this.db.run(
            'ALTER TABLE bonder_balances ADD COLUMN arbitrum_weth_amount NUMERIC;'
          )
        }
        if (migrations.includes(9)) {
          this.db.run(
            'ALTER TABLE bonder_balances ADD COLUMN withdrawn_amount NUMERIC;'
          )
        }
        if (migrations.includes(10)) {
          this.db.run(
            'ALTER TABLE bonder_balances ADD COLUMN unstaked_eth_amount NUMERIC;'
          )
        }
        if (migrations.includes(11)) {
          this.db.run(
            'ALTER TABLE bonder_balances ADD COLUMN bonder_address TEXT;'
          )
        }
        if (migrations.includes(12)) {
          this.db.run(
            'ALTER TABLE bonder_balances ADD COLUMN deposit_event TEXT;'
          )
        }
        if (migrations.includes(13)) {
          this.db.run(
            'ALTER TABLE bonder_balances ADD COLUMN restaked_eth_amount TEXT;'
          )
        }
        if (migrations.includes(14)) {
          this.db.run(
            'ALTER TABLE bonder_balances ADD COLUMN initial_eth_amount NUMERIC;'
          )
        }
        if (migrations.includes(15)) {
          this.db.run(
            'ALTER TABLE bonder_balances ADD COLUMN initial_matic_amount NUMERIC;'
          )
        }
        if (migrations.includes(16)) {
          this.db.run(
            'ALTER TABLE bonder_balances ADD COLUMN initial_xdai_amount NUMERIC;'
          )
        }
        if (migrations.includes(17)) {
          this.db.run(
            'ALTER TABLE bonder_balances ADD COLUMN withdraw_event TEXT;'
          )
        }
        if (migrations.includes(18)) {
          this.db.run(
            'ALTER TABLE bonder_balances ADD COLUMN arbitrum_messenger_wrapper_amount NUMERIC;'
          )
        }
        if (migrations.includes(19)) {
          this.db.run(
            'ALTER TABLE bonder_balances ADD COLUMN nova_block_number INTEGER;'
          )
          this.db.run(
            'ALTER TABLE bonder_balances ADD COLUMN nova_canonical_amount NUMERIC;'
          )
          this.db.run(
            'ALTER TABLE bonder_balances ADD COLUMN nova_hToken_amount NUMERIC;'
          )
          this.db.run(
            'ALTER TABLE bonder_balances ADD COLUMN nova_native_amount NUMERIC;'
          )
        }

        migrationRan = true
      }

      this.db.run(
        'CREATE UNIQUE INDEX IF NOT EXISTS idx_volume_stats_chain_token_timestamp ON volume_stats (chain, token, timestamp);'
      )
      this.db.run(
        'CREATE UNIQUE INDEX IF NOT EXISTS idx_tvl_pool_stats_chain_token_timestamp ON tvl_pool_stats (chain, token, timestamp);'
      )
      this.db.run(
        'CREATE UNIQUE INDEX IF NOT EXISTS idx_token_prices_token_timestamp ON token_prices (token, timestamp);'
      )
      this.db.run('DROP INDEX IF EXISTS idx_bonder_balances_token_timestamp;')
      this.db.run(
        'CREATE UNIQUE INDEX IF NOT EXISTS idx_bonder_balances_token_bonder_timestamp ON bonder_balances (token, bonder_address, timestamp);'
      )
      this.db.run(
        'CREATE UNIQUE INDEX IF NOT EXISTS idx_bonder_tx_fees_token_timestamp ON bonder_tx_fees (token, timestamp);'
      )
      this.db.run(
        'CREATE UNIQUE INDEX IF NOT EXISTS idx_amm_stats_chain_token_timestamp ON amm_stats (chain, token, timestamp);'
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

  async upsertAmmStat (
    chain: string,
    token: string,
    volume: number,
    volumeUsd: number,
    fees: number,
    feesUsd: number,
    timestamp: number
  ) {
    const stmt = this.db.prepare(
      'INSERT OR REPLACE INTO amm_stats VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    )
    stmt.run(uuid(), chain, token, volume, volumeUsd, fees, feesUsd, timestamp)
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

  async getTvlPoolStats () {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT id, chain, token, amount, amount_usd, timestamp FROM tvl_pool_stats;',
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

  // keep order of args the same as when columns were created/added
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
    timestamp: number,
    result2: number = 0,
    ethAmounts: number = 0,
    xdaiPriceUsd: number = 1,
    depositAmount: number = 0,
    stakedAmount: number = 0,
    initialCanonicalAmount: number = 0,
    result3: number = 0,
    arbitrumWethAmount: number = 0,
    withdrawnAmount: number = 0,
    unstakedEthAmount: number = 0,
    bonderAddress: string = '',
    depositEvent: number | null = null,
    restakedEthAmount: number | null = null,
    initialEthAmount: number | null = null,
    initialMaticAmount: number | null = null,
    initialxDaiAmount: number | null = null,
    withdrawEvent: number | null = null,
    arbitrumMessengerWrapperAmount: number = 0,
    novaBlockNumber: number,
    novaCanonicalAmount: number = 0,
    novaHTokenAmount: number = 0,
    novaNativeAmount: number = 0
  ) {
    const stmt = this.db.prepare(
      'INSERT OR REPLACE INTO bonder_balances VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
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
      timestamp,
      result2,
      ethAmounts,
      xdaiPriceUsd,
      depositAmount,
      stakedAmount,
      initialCanonicalAmount,
      result3,
      arbitrumWethAmount,
      withdrawnAmount,
      unstakedEthAmount,
      bonderAddress,
      depositEvent,
      restakedEthAmount,
      initialEthAmount,
      initialMaticAmount,
      initialxDaiAmount,
      withdrawEvent,
      arbitrumMessengerWrapperAmount,
      novaBlockNumber,
      novaCanonicalAmount,
      novaHTokenAmount,
      novaNativeAmount
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
      polygonFees,
      gnosisFees,
      arbitrumFees,
      optimismFees,
      ethereumFees,
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
    timestamp: number = 0,
    xdaiPriceUsd: number = 0
  ) {
    const stmt = this.db.prepare(
      'INSERT OR REPLACE INTO bonder_tx_fees VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
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
      timestamp,
      xdaiPriceUsd
    )
    stmt.finalize()
  }

  close () {
    this.db.close()
  }
}

export default Db
