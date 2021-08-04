import GasBoostTransaction, { Options } from './GasBoostTransaction'
import MemoryStore from './MemoryStore'
import Store from './Store'
import { Signer, providers } from 'ethers'
import { boundClass } from 'autobind-decorator'

export { Options }

@boundClass
class GasBoostTransactionFactory {
  signer: Signer
  store: Store = new MemoryStore()
  options: Partial<Options> = {}

  constructor (signer: Signer, store?: Store, options: Partial<Options> = {}) {
    this.signer = signer
    if (store) {
      this.store = store
    }

    this.setOptions(options)
  }

  createTransaction (tx: providers.TransactionRequest) {
    const gTx = new GasBoostTransaction(tx, this.signer, this.store, this.options)
    return gTx
  }

  async getTransactionFromId (id: string) {
    return GasBoostTransaction.fromId(id, this.signer, this.store, this.options)
  }

  setOptions (options: Partial<Options>): void {
    this.options = options
  }
}

export default GasBoostTransactionFactory
