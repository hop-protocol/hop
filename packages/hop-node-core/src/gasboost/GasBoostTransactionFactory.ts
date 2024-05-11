import { GasBoostTransaction, type Options } from './GasBoostTransaction.js'
import type { Signer, providers } from 'ethers'
import type { Store } from './Store.js'

export { type Options }

export class GasBoostTransactionFactory {
  signer: Signer
  store!: Store
  options: Partial<Options> = {}
  chainId!: string

  constructor (signer: Signer, store?: Store, options: Partial<Options> = {}) {
    this.signer = signer
    if (store != null) {
      this.store = store
    }

    this.setOptions(options)
    this.#init()
      .then(() => {
        console.log('GasBoostTransactionFactory init success', this.chainId)
      })
      .catch(() => {
        throw new Error('init error')
      })
  }

  async #init(): Promise<void> {
    this.chainId = (await this.signer.getChainId()).toString()
  }

  createTransaction (tx: providers.TransactionRequest, id?: string): GasBoostTransaction {
    if (!this.chainId) {
      throw new Error('chainId not set')
    }
    const gTx = new GasBoostTransaction(tx, this.chainId, this.signer, this.store, this.options, id)
    return gTx
  }

  async getTransactionFromId (id: string): Promise<GasBoostTransaction> {
    return GasBoostTransaction.fromId(id, this.chainId, this.signer, this.store, this.options)
  }

  setOptions (options: Partial<Options>): void {
    this.options = options
  }
}
