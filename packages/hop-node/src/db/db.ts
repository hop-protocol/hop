import GasBoostDb from './GasBoostDb'
import GasPricesDb from './GasPricesDb'
import SyncStateDb from './SyncStateDb'
import TokenPricesDb from './TokenPricesDb'
import TransferRootsDb from './TransferRootsDb'
import TransfersDb from './TransfersDb'

// db instances (initialized only once)

// gas prices and token prices db are global (not token specific)
let gasPricesDb: GasPricesDb | null = null
let tokenPricesDb: TokenPricesDb | null = null

// dbSets are token specific instances
const dbSets : {[db: string]: {[tokenSymbol: string]: any}} = {
  gasBoostDb: {},
  syncStateDb: {},
  transfersDb: {},
  transferRootsDb: {}
}

export const getGasPricesDb = () => {
  if (!gasPricesDb) {
    gasPricesDb = new GasPricesDb('gasPrices')
  }
  return gasPricesDb
}

export const getTokenPricesDb = () => {
  if (!tokenPricesDb) {
    tokenPricesDb = new TokenPricesDb('tokenPrices')
  }
  return tokenPricesDb
}

export function getDbSet (tokenSymbol: string) {
  if (!tokenSymbol) {
    throw new Error('token symbol is required to namespace leveldbs')
  }

  // lazy instantiate with getters
  return {
    get gasBoost () {
      if (!dbSets.gasBoostDb[tokenSymbol]) {
        dbSets.gasBoostDb[tokenSymbol] = new GasBoostDb('gasBoost')
      }
      return dbSets.gasBoostDb[tokenSymbol]
    },
    get syncState () {
      if (!dbSets.syncStateDb[tokenSymbol]) {
        dbSets.syncStateDb[tokenSymbol] = new SyncStateDb('state', tokenSymbol)
      }
      return dbSets.syncStateDb[tokenSymbol]
    },
    get transfers () {
      if (!dbSets.transfersDb[tokenSymbol]) {
        dbSets.transfersDb[tokenSymbol] = new TransfersDb('transfers', tokenSymbol)
      }
      return dbSets.transfersDb[tokenSymbol]
    },
    get transferRoots () {
      if (!dbSets.transferRootsDb[tokenSymbol]) {
        dbSets.transferRootsDb[tokenSymbol] = new TransferRootsDb('transferRoots', tokenSymbol)
      }
      return dbSets.transferRootsDb[tokenSymbol]
    },
    get gasPrices () {
      return getGasPricesDb()
    },
    get tokenPrices () {
      return getTokenPricesDb()
    }
  }
}

export type Db = any
export default { getDbSet, getGasPricesDb, getTokenPricesDb }
