import GasBoostTransaction from './GasBoostTransaction'
import GasBoostTransactionFactory, { Options } from './GasBoostTransactionFactory'
import MemoryStore from './MemoryStore'
import Store from './Store'
import queue from 'src/decorators/queue'
import rateLimitRetry from 'src/decorators/rateLimitRetry'
import { Signer, Wallet, providers } from 'ethers'
import { boundClass } from 'autobind-decorator'
import { getProviderChainSlug } from 'src/utils'

@boundClass
class GasBoostSigner extends Wallet {
  store: Store = new MemoryStore()
  items: string[] = []
  chainSlug: string
  gTxFactory: GasBoostTransactionFactory
  signer: Signer
  pollMs: number

  constructor (privateKey: string, provider?: providers.Provider, store?: Store, options: Partial<Options> = {}) {
    super(privateKey, provider)
    this.signer = new Wallet(privateKey, provider)
    if (store) {
      this.store = store
    }
    const chainSlug = getProviderChainSlug(this.signer.provider)
    if (!chainSlug) {
      throw new Error('chain slug not found for contract provider')
    }
    this.chainSlug = chainSlug
    this.gTxFactory = new GasBoostTransactionFactory(this.signer, this.store)
    this.setOptions(options)
    this.restore()
  }

  setStore (store: Store) {
    this.store = store
  }

  getQueueGroup (): string {
    return `gasBoost:${this.chainSlug}`
  }

  @queue
  @rateLimitRetry
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

  setPollMs (pollMs: number) {
    this.setOptions({
      pollMs
    })
  }

  setTimeTilBoostMs (timeTilBoostMs: number) {
    this.setOptions({
      timeTilBoostMs
    })
  }

  setGasPriceMutliplier (gasPriceMultiplier: number) {
    this.setOptions({
      gasPriceMultiplier
    })
  }

  setMaxGasPriceGwei (maxGasPriceGwei: number) {
    this.setOptions({
      maxGasPriceGwei
    })
  }

  setOptions (options: Partial<Options> = {}): void {
    this.gTxFactory.setOptions(options)
  }
}

export default GasBoostSigner
