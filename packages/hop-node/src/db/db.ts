import GasBoostDb from './GasBoostDb.js'
import GasCostDb from './GasCostDb.js'
import SyncStateDb from './SyncStateDb.js'
import TransferRootsDb from './TransferRootsDb.js'
import TransfersDb from './TransfersDb.js'

// dbSets are token specific instances
const dbSets: {[db: string]: {[tokenSymbol: string]: any}} = {
  syncStateDb: {},
  transfersDb: {},
  transferRootsDb: {},
  gasCostDb: {}
}

// gasBoostDbs are chain specific instances
const gasBoostDbs: {[chain: string]: any} = {}

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

  // do not lazy instantiate since we need to check if db is ready
  if (!dbSets.syncStateDb[tokenSymbol]) {
    dbSets.syncStateDb[tokenSymbol] = new SyncStateDb('state', tokenSymbol)
  }
  if (!dbSets.transfersDb[tokenSymbol]) {
    dbSets.transfersDb[tokenSymbol] = new TransfersDb('transfers', tokenSymbol)
  }
  if (!dbSets.transferRootsDb[tokenSymbol]) {
    dbSets.transferRootsDb[tokenSymbol] = new TransferRootsDb('transferRoots', tokenSymbol)
  }
  if (!dbSets.gasCostDb[tokenSymbol]) {
    dbSets.gasCostDb[tokenSymbol] = new GasCostDb('gasCost', tokenSymbol)
  }

  return {
    syncState: dbSets.syncStateDb[tokenSymbol],
    transfers: dbSets.transfersDb[tokenSymbol],
    transferRoots: dbSets.transferRootsDb[tokenSymbol],
    gasCost: dbSets.gasCostDb[tokenSymbol]
  }
}

export function isDbSetReady (tokenSymbol: string): boolean {
  for (const dbSet of Object.values(dbSets)) {
    const db = dbSet[tokenSymbol]
    if (!db.isReady()) {
      return false
    }
  }
  return true
}

export function getGasBoostDb (chain: string): GasBoostDb {
  if (!gasBoostDbs[chain]) {
    gasBoostDbs[chain] = new GasBoostDb('gasBoost', chain)
  }
  return gasBoostDbs[chain]
}
