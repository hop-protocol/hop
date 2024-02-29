import { GasBoostTransaction, Options } from './GasBoostTransaction.js'
import { Store } from './Store.js'
import { Signer, providers } from 'ethers'

export { Options }

export class GasBoostTransactionFactory {
  signer: Signer
  store: Store
  options: Partial<Options> = {}

  constructor (signer: Signer, store?: Store, options: Partial<Options> = {}) {
    this.signer = signer
    if (store != null) {
      this.store = store
    }

    this.setOptions(options)
  }

  createTransaction (tx: providers.TransactionRequest, id?: string) {
    const gTx = new GasBoostTransaction(tx, this.signer, this.store, this.options, id)
    return gTx
  }

  async getTransactionFromId (id: string) {
    return GasBoostTransaction.fromId(id, this.signer, this.store, this.options)
  }

  setOptions (options: Partial<Options>): void {
    this.options = options
  }
}
