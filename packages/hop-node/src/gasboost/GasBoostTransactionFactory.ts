import GasBoostTransaction from './GasBoostTransaction'
import MemoryStore from './MemoryStore'
import Store from './Store'
import { Signer, providers } from 'ethers'

class GasBoostTransactionFactory {
  signer: Signer
  store: Store = new MemoryStore()

  constructor (signer: Signer, store?: Store) {
    this.signer = signer
    if (store) {
      this.store = store
    }
  }

  createTransaction (tx: providers.TransactionRequest) {
    return new GasBoostTransaction(tx, this.signer, this.store)
  }

  async getTransactionFromId (id: string) {
    return GasBoostTransaction.fromId(id, this.signer, this.store)
  }
}

export default GasBoostTransactionFactory
