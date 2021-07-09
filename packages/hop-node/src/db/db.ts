import SyncStateDb from './SyncStateDb'
import TransferRootsDb from './TransferRootsDb'
import TransfersDb from './TransfersDb'

let syncStateDb: SyncStateDb | null = null
let transfersDb: TransfersDb | null = null
let transferRootsDb: TransferRootsDb | null = null

// lazy instantiate
export default {
  get transfers () {
    if (!transfersDb) {
      transfersDb = new TransfersDb('transfers')
    }
    return transfersDb
  },
  get transferRoots () {
    if (!transferRootsDb) {
      transferRootsDb = new TransferRootsDb('transferRoots')
    }
    return transferRootsDb
  },
  get syncState () {
    if (!syncStateDb) {
      syncStateDb = new SyncStateDb('state')
    }
    return syncStateDb
  }
}
