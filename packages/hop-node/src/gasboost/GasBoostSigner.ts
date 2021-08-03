import GasBoostTransaction from './GasBoostTransaction'
import MemoryStore from './MemoryStore'
import Store from './Store'
import { Wallet, providers } from 'ethers'

class GasBoostSigner extends Wallet {
  store: Store = new MemoryStore()
  items: string[] = []

  constructor (privateKey: string, provider?: providers.Provider, store?: Store) {
    super(privateKey, provider)
    if (store) {
      this.store = store
    }
    this.restore()
  }

  setStore (store: Store) {
    this.store = store
  }

  async sendTransaction (tx: providers.TransactionRequest): Promise<providers.TransactionResponse> {
    const gTx = new GasBoostTransaction(tx, this, this.store)
    await this.track(gTx)
    await gTx.save()
    await gTx.send()
    return gTx
  }

  private async restore () {
    const items = await this.store.getItems()
    if (items) {
      for (const item of items) {
        const gTx = await GasBoostTransaction.fromId(item.id, this, this.store)
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
