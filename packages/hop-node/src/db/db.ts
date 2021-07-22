import SyncStateDb from './SyncStateDb'
import TransferRootsDb from './TransferRootsDb'
import TransfersDb from './TransfersDb'

export function getDbSet (tokenSymbol: string) {
  if (!tokenSymbol) {
    throw new Error('token symbol is required to namespace leveldbs')
  }

  let syncStateDb: SyncStateDb | null = null
  let transfersDb: TransfersDb | null = null
  let transferRootsDb: TransferRootsDb | null = null

  // lazy instantiate with getters
  return {
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
    },
    get syncState () {
      if (!syncStateDb) {
        syncStateDb = new SyncStateDb('state', tokenSymbol)
      }
      return syncStateDb
    }
  }
}

export default { getDbSet }
