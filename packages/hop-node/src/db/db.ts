import GasBoostDb from './GasBoostDb'
import GasCostDb from './GasCostDb'
import GasPricesDb from './GasPricesDb'
import SyncStateDb from './SyncStateDb'
import TokenPricesDb from './TokenPricesDb'
import TransferRootsDb from './TransferRootsDb'
import TransfersDb from './TransfersDb'

// these are the db instances (initialized only once).
// gas prices and token prices db are global (not token specific)
let gasPricesDb: GasPricesDb | null = null
let tokenPricesDb: TokenPricesDb | null = null

// dbSets are token specific instances
const dbSets : {[db: string]: {[tokenSymbol: string]: any}} = {
  gasBoostDb: {},
  syncStateDb: {},
  transfersDb: {},
  transferRootsDb: {},
  gasCostDb: {}
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

export type Db = GasBoostDb | GasPricesDb | SyncStateDb | TokenPricesDb | TransferRootsDb | TransfersDb | GasCostDb
export type DbSet = {
  gasBoost: GasBoostDb,
  syncState: SyncStateDb,
  transfers: TransfersDb,
  transferRoots: TransferRootsDb,
  gasPrices: GasPricesDb,
  tokenPrices : TokenPricesDb,
  gasCost: GasCostDb,
}

export function getDbSet (tokenSymbol: string): DbSet {
  if (!tokenSymbol) {
    throw new Error('token symbol is required to namespace leveldbs')
  }

  // lazy instantiate with getters
  return {
    get gasBoost (): GasBoostDb {
      if (!dbSets.gasBoostDb[tokenSymbol]) {
        dbSets.gasBoostDb[tokenSymbol] = new GasBoostDb('gasBoost')
      }
      return dbSets.gasBoostDb[tokenSymbol]
    },
    get syncState () : SyncStateDb {
      if (!dbSets.syncStateDb[tokenSymbol]) {
        dbSets.syncStateDb[tokenSymbol] = new SyncStateDb('state', tokenSymbol)
      }
      return dbSets.syncStateDb[tokenSymbol]
    },
    get transfers () : TransfersDb {
      if (!dbSets.transfersDb[tokenSymbol]) {
        dbSets.transfersDb[tokenSymbol] = new TransfersDb('transfers', tokenSymbol)
      }
      return dbSets.transfersDb[tokenSymbol]
    },
    get transferRoots () : TransferRootsDb {
      if (!dbSets.transferRootsDb[tokenSymbol]) {
        dbSets.transferRootsDb[tokenSymbol] = new TransferRootsDb('transferRoots', tokenSymbol)
      }
      return dbSets.transferRootsDb[tokenSymbol]
    },
    get gasPrices () : GasPricesDb {
      return getGasPricesDb()
    },
    get tokenPrices () : TokenPricesDb {
      return getTokenPricesDb()
    },
    get gasCost (): GasCostDb {
      if (!dbSets.gasCostDb[tokenSymbol]) {
        dbSets.gasCostDb[tokenSymbol] = new GasCostDb('gasCost', tokenSymbol)
      }
      return dbSets.gasCostDb[tokenSymbol]
    }
  }
}

export default { getDbSet, getGasPricesDb, getTokenPricesDb }
