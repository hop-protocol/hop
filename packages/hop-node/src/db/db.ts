import GasBoostDb from './GasBoostDb'
import GasCostDb from './GasCostDb'
import SyncStateDb from './SyncStateDb'
import TransferRootsDb from './TransferRootsDb'
import TransfersDb from './TransfersDb'

// dbSets are token specific instances
const dbSets: {[db: string]: {[tokenSymbol: string]: any}} = {
  syncStateDb: {},
  transfersDb: {},
  transferRootsDb: {},
  gasCostDb: {}
}

// gasBoostDbs are chain specific instances
const gasBoostDbs: {[chain: string]: any} = {}

type Db = SyncStateDb | TransferRootsDb | TransfersDb | GasCostDb
export type DbSet = {
  syncState: SyncStateDb
  transfers: TransfersDb
  transferRoots: TransferRootsDb
  gasCost: GasCostDb
}

export function getDbSet (tokenSymbol: string): DbSet {
  if (!tokenSymbol) {
    throw new Error('token symbol is required to namespace leveldbs')
  }

  // lazy instantiate with getters
  return {
    get syncState (): SyncStateDb {
      if (!dbSets.syncStateDb[tokenSymbol]) {
        dbSets.syncStateDb[tokenSymbol] = new SyncStateDb('state', tokenSymbol)
      }
      return dbSets.syncStateDb[tokenSymbol]
    },
    get transfers (): TransfersDb {
      if (!dbSets.transfersDb[tokenSymbol]) {
        dbSets.transfersDb[tokenSymbol] = new TransfersDb('transfers', tokenSymbol)
      }
      return dbSets.transfersDb[tokenSymbol]
    },
    get transferRoots (): TransferRootsDb {
      if (!dbSets.transferRootsDb[tokenSymbol]) {
        dbSets.transferRootsDb[tokenSymbol] = new TransferRootsDb('transferRoots', tokenSymbol)
      }
      return dbSets.transferRootsDb[tokenSymbol]
    },
    get gasCost (): GasCostDb {
      if (!dbSets.gasCostDb[tokenSymbol]) {
        dbSets.gasCostDb[tokenSymbol] = new GasCostDb('gasCost', tokenSymbol)
      }
      return dbSets.gasCostDb[tokenSymbol]
    }
  }
}

export function getGasBoostDb (chain: string): GasBoostDb {
  if (!gasBoostDbs[chain]) {
    gasBoostDbs[chain] = new GasBoostDb('gasBoost', chain)
  }
  return gasBoostDbs[chain]
}
