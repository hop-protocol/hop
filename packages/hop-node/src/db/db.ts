import GasBoostDb from './GasBoostDb'
import GasPricesDb from './GasPricesDb'
import SyncStateDb from './SyncStateDb'
import TransferRootsDb from './TransferRootsDb'
import TransfersDb from './TransfersDb'

let gasPricesDb: GasPricesDb | null = null

export const getGasPricesDb = () => {
  if (!gasPricesDb) {
    gasPricesDb = new GasPricesDb('gasPrices')
  }
  return gasPricesDb
}

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
    },
    get gasPrices () {
      return getGasPricesDb()
    }
  }
}

export type Db = any
export default { getDbSet, getGasPricesDb }
