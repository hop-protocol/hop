import GasBoostTransaction from './GasBoostTransaction'
import GasBoostTransactionFactory from './GasBoostTransactionFactory'
import MemoryStore from './MemoryStore'
import Store from './Store'
import { Wallet, providers } from 'ethers'

class GasBoostSigner extends Wallet {
  store: Store = new MemoryStore()
  items: string[] = []
  gTxFactory: GasBoostTransactionFactory

  constructor (privateKey: string, provider?: providers.Provider, store?: Store) {
    super(privateKey, provider)
    if (store) {
      this.store = store
    }
    this.gTxFactory = new GasBoostTransactionFactory(this, this.store)
    this.restore()
  }

  setStore (store: Store) {
    this.store = store
  }

  async sendTransaction (tx: providers.TransactionRequest): Promise<providers.TransactionResponse> {
    const gTx = this.gTxFactory.createTransaction(tx)
    await this.track(gTx)
    await gTx.save()
    await gTx.send()
    return gTx
  }

  private async restore () {
    const items = await this.store.getItems()
    if (items) {
      for (const item of items) {
        const gTx = await this.gTxFactory.getTransactionFromId(item.id)
        this.items.push(gTx.id)
      }
    }
  }

  private track (gTx: GasBoostTransaction) {
    this.items.push(gTx.id)
    this.store.updateItem(gTx.id, gTx.marshal())
  }
}

export default GasBoostSigner
