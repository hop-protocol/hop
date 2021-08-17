import GasBoostDb from './GasBoostDb'
import SyncStateDb from './SyncStateDb'
import TransferRootsDb from './TransferRootsDb'
import TransfersDb from './TransfersDb'

export function getDbSet (tokenSymbol: string) {
  if (!tokenSymbol) {
    throw new Error('token symbol is required to namespace leveldbs')
  }

  let gasBoostDb : GasBoostDb | null = null
  let syncStateDb: SyncStateDb | null = null
  let transfersDb: TransfersDb | null = null
  let transferRootsDb: TransferRootsDb | null = null

  // lazy instantiate with getters
  return {
    get gasBoost () {
      if (!gasBoostDb) {
        gasBoostDb = new GasBoostDb('gasBoost')
      }
      return gasBoostDb
    },
    get syncState () {
      if (!syncStateDb) {
        syncStateDb = new SyncStateDb('state', tokenSymbol)
      }
      return syncStateDb
    },
    get transfers () {
      if (!transfersDb) {
        transfersDb = new TransfersDb('transfers', tokenSymbol)
      }
      return transfersDb
    },
    get transferRoots () {
      if (!transferRootsDb) {
        transferRootsDb = new TransferRootsDb('transferRoots', tokenSymbol)
      }
      return transferRootsDb
    }
  }
}

export type Db = any
export default { getDbSet }
