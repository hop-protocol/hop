import GasBoostTransactionFactory, { Options } from './GasBoostTransactionFactory'
import Logger from 'src/logger'
import MemoryStore from './MemoryStore'
import Store from './Store'
import getProviderChainSlug from 'src/utils/getProviderChainSlug'
import wait from 'src/utils/wait'
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
  chainSlug: string
  gTxFactory: GasBoostTransactionFactory
  signer: Signer
  pollMs: number
  logger: Logger
  notifier: Notifier
  mutex: Mutex
  ready: boolean = false

  constructor (privateKey: string, provider?: providers.Provider, store: Store = new MemoryStore(), options: Partial<Options> = {}) {
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
    this.gTxFactory = new GasBoostTransactionFactory(this.signer)
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
    this.init()
      .catch((err: Error) => this.logger.error('init error:', err))
      .finally(async () => {
        const nonce = await this.getDbNonce()
        this.logger.debug('ready')
        this.logger.debug(`current nonce: ${nonce}`)
        this.ready = true
      })
  }

  private async init () {
    // prevent additional bonder instances from overriding db nonce (ie when running separate cli commands)
    const shouldUpdate = await this.shouldSetLatestNonce()
    if (shouldUpdate) {
      await this.setLatestNonce()
    }
  }

  private async shouldSetLatestNonce () {
    return true
    /*
    const item = await this.store.getItem('nonce')
    const timeWindowMs = 5 * 60 * 1000
    if (item?.updatedAt && Number(item.updatedAt) + timeWindowMs < Date.now()) {
      return false
    }
    return true
    */
  }

  protected async tilReady (): Promise<boolean> {
    if (this.ready) {
      return true
    }

    await wait(100)
    return await this.tilReady()
  }

  private async setLatestNonce () {
    const onChainNonce = await this.getOnChainNonce()
    await this.setDbNonce(onChainNonce)
  }

  // this is a required ethers Signer method
  async sendTransaction (tx: providers.TransactionRequest): Promise<providers.TransactionResponse> {
    await this.tilReady()
    return await this.mutex.runExclusive(async () => {
      this.logger.debug(`unlocked tx: ${JSON.stringify(tx)}`)
      return await this._sendTransaction(tx)
    })
  }

  async _sendTransaction (tx: providers.TransactionRequest): Promise<providers.TransactionResponse> {
    const nonce = await this.getDbNonce()
    if (!tx.nonce) {
      tx.nonce = nonce
    }
    const gTx = this.gTxFactory.createTransaction(tx)
    await gTx.save()
    try {
      await gTx.send()
    } catch (err) {
      // if nonce too low then we still want to increment the tracked nonce
      // before throwing error
      if (err instanceof NonceTooLowError) {
        await this.incNonce()
        const newNonce = await this.getDbNonce()
        this.logger.debug(`increment for NonceTooLowError. new nonce ${newNonce}`)
      }
      throw err
    }
    await this.incNonce()
    this.lastTxSentTimestamp = Date.now()
    return gTx
  }

  async getNonce () {
    return this.getDbNonce()
  }

  private async getOnChainNonce () {
    return this.signer.getTransactionCount('pending')
  }

  private async getDbNonce () {
    const item = await this.store.getItem('nonce')
    return item?.nonce ?? 0
  }

  private async incNonce () {
    let nonce = await this.getDbNonce()
    nonce++
    await this.setDbNonce(nonce)
  }

  private async setDbNonce (nonce: number) {
    await this.store.updateItem('nonce', {
      nonce,
      updatedAt: Date.now()
    })
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
