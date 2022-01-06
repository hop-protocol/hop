import GasBoostTransaction from './GasBoostTransaction'
import GasBoostTransactionFactory, { Options } from './GasBoostTransactionFactory'
import Logger from 'src/logger'
import Store from './Store'
import getProviderChainSlug from 'src/utils/getProviderChainSlug'
import { Mutex } from 'async-mutex'
import { NonceTooLowError } from 'src/types/error'
import { Notifier } from 'src/notifier'
import { Signer, Wallet, providers } from 'ethers'
import { hostname } from 'src/config'

class GasBoostSigner extends Wallet {
  store: Store
  items: string[] = []
  lastTxSentTimestamp: number = 0
  delayBetweenTxsMs: number = 7 * 1000
  nonce: number = 0
  chainSlug: string
  gTxFactory: GasBoostTransactionFactory
  signer: Signer
  pollMs: number
  logger: Logger
  notifier: Notifier
  mutex: Mutex

  constructor (privateKey: string, provider?: providers.Provider, store?: Store, options: Partial<Options> = {}) {
    super(privateKey, provider)
    this.signer = new Wallet(privateKey, provider)
    if (store != null) {
      this.store = store
    }
    const chainSlug = getProviderChainSlug(this.signer.provider)
    if (!chainSlug) {
      throw new Error('chain slug not found for contract provider')
    }
    this.chainSlug = chainSlug
    this.mutex = new Mutex()
    this.gTxFactory = new GasBoostTransactionFactory(this.signer, this.store)
    const tag = 'GasBoostSigner'
    const prefix = `${this.chainSlug}`
    this.logger = new Logger({
      tag,
      prefix
    })
    this.notifier = new Notifier(
      `GasBoostSigner, label: ${prefix}, host: ${hostname}`
    )
    this.setOptions(options)
    this.restore()
  }

  setStore (store: Store) {
    this.store = store
  }

  // this is a required ethers Signer method
  async sendTransaction (tx: providers.TransactionRequest): Promise<providers.TransactionResponse> {
    return await this.mutex.runExclusive(async () => {
      this.logger.debug(`unlocked tx: ${JSON.stringify(tx)}`)
      return await this._sendTransaction(tx)
    })
  }

  _sendTransaction = async (tx: providers.TransactionRequest): Promise<providers.TransactionResponse> => {
    const nonce = await this.getNonce()
    if (!tx.nonce) {
      tx.nonce = nonce
    }
    const gTx = this.gTxFactory.createTransaction(tx)
    this.track(gTx)
    await gTx.save()
    try {
      await gTx.send()
    } catch (err) {
      // if nonce too low then we still want to increment the tracked nonce
      // before throwing error
      if (err instanceof NonceTooLowError) {
        this.nonce++
        this.logger.debug(`increment for NonceTooLowError. new nonce ${this.nonce}`)
      }
      throw err
    }
    this.nonce++
    this.lastTxSentTimestamp = Date.now()
    return gTx
  }

  private async getNonce () {
    if (!this.nonce) {
      this.nonce = await this.signer.getTransactionCount('pending')
    }

    return this.nonce
  }

  private async restore () {
    if (!this.store) {
      return
    }
    const items = await this.store.getItems()
    if (items) {
      for (const item of items) {
        const gTx = await this.gTxFactory.getTransactionFromId(item.id)
        this.items.push(gTx.id)
      }
    }
  }

  private track (gTx: GasBoostTransaction) {
    if (!this.store) {
      return
    }
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

  setGasPriceMultiplier (gasPriceMultiplier: number) {
    this.setOptions({
      gasPriceMultiplier
    })
  }

  setMaxGasPriceGwei (maxGasPriceGwei: number) {
    this.setOptions({
      maxGasPriceGwei
    })
  }

  setMinPriorityFeePerGas (minPriorityFeePerGas: number) {
    this.setOptions({
      minPriorityFeePerGas
    })
  }

  setPriorityFeePerGasCap (priorityFeePerGasCap: number) {
    this.setOptions({
      priorityFeePerGasCap
    })
  }

  setOptions (options: Partial<Options> = {}): void {
    this.logger.debug('options:', JSON.stringify(options))
    this.gTxFactory.setOptions(options)
  }
}

export default GasBoostSigner
