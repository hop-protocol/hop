import GasBoostDb from './GasBoostDb'
import GasPricesDb from './GasPricesDb'
import SyncStateDb from './SyncStateDb'
import TokenPricesDb from './TokenPricesDb'
import TransferRootsDb from './TransferRootsDb'
import TransfersDb from './TransfersDb'

let gasPricesDb: GasPricesDb | null = null
let tokenPricesDb: TokenPricesDb | null = null

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

export type Db = GasBoostDb | GasPricesDb | SyncStateDb | TokenPricesDb | TransferRootsDb | TransfersDb
export type DbSet = {
  gasBoost: GasBoostDb,
  syncState: SyncStateDb,
  transfers: TransfersDb,
  transferRoots: TransferRootsDb,
  gasPrices: GasPricesDb,
  tokenPrices : TokenPricesDb,
}

export function getDbSet (tokenSymbol: string): DbSet {
  if (!tokenSymbol) {
    throw new Error('token symbol is required to namespace leveldbs')
  }

  let gasBoostDb : GasBoostDb | null = null
  let syncStateDb: SyncStateDb | null = null
  let transfersDb: TransfersDb | null = null
  let transferRootsDb: TransferRootsDb | null = null

  // lazy instantiate with getters
  return {
    get gasBoost (): GasBoostDb {
      if (!gasBoostDb) {
        gasBoostDb = new GasBoostDb('gasBoost')
      }
      return gasBoostDb
    },
    get syncState (): SyncStateDb {
      if (!syncStateDb) {
        syncStateDb = new SyncStateDb('state', tokenSymbol)
      }
      return syncStateDb
    },
    get transfers () : TransfersDb {
      if (!transfersDb) {
        transfersDb = new TransfersDb('transfers', tokenSymbol)
      }
      return transfersDb
    },
    get transferRoots () : TransferRootsDb {
      if (!transferRootsDb) {
        transferRootsDb = new TransferRootsDb('transferRoots', tokenSymbol)
      }
      return transferRootsDb
    },
    get gasPrices () : GasPricesDb {
      return getGasPricesDb()
    },
    get tokenPrices () : TokenPricesDb {
      return getTokenPricesDb()
    }
  }
}

export default { getDbSet, getGasPricesDb, getTokenPricesDb }
