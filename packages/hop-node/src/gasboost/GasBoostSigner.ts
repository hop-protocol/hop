import GasBoostTransactionFactory, { Options } from './GasBoostTransactionFactory'
import Logger from 'src/logger'
import MemoryStore from './MemoryStore'
import Store from './Store'
import getProviderChainSlug from 'src/utils/getProviderChainSlug'
import wait from 'src/utils/wait'
import { Mutex } from 'async-mutex'
import { NonceTooLowError } from 'src/types/error'
import { Notifier } from 'src/notifier'
import { Signer, providers } from 'ethers'
import { defineReadOnly } from 'ethers/lib/utils'
import { hostname, setLatestNonceOnStart } from 'src/config'
import { v4 as uuidv4 } from 'uuid'

class GasBoostSigner extends Signer {
  store: Store
  items: string[] = []
  lastTxSentTimestamp: number = 0
  chainSlug: string
  gTxFactory: GasBoostTransactionFactory
  signer: Signer
  pollMs: number
  logger: Logger
  notifier: Notifier
  mutex: Mutex
  ready: boolean = false
  options: Partial<Options>
  private _count: number = 0

  constructor (signer: Signer, store: Store = new MemoryStore(), options: Partial<Options> = {}) {
    super()
    this.signer = signer
    defineReadOnly(this, 'provider', signer.provider)
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

  connect (provider: providers.Provider) {
    const _signer = this.signer.connect(provider)
    return new GasBoostSigner(_signer, this.store, this.options)
  }

  async getAddress () {
    return this.signer.getAddress()
  }

  async signMessage (msg: Buffer | string) {
    return this.signer.signMessage(msg)
  }

  async signTransaction (transaction: providers.TransactionRequest) {
    return this.signer.signTransaction(transaction)
  }

  private async init () {
    // prevent additional bonder instances from overriding db nonce (ie when running separate cli commands)
    const shouldUpdate = await this.shouldSetLatestNonce()
    if (shouldUpdate) {
      await this.setLatestNonce()
    }
  }

  private async shouldSetLatestNonce () {
    if (setLatestNonceOnStart) {
      return true
    }
    const item = await this.store.getItem('nonce')
    const timeWindowMs = 5 * 60 * 1000
    if (item?.updatedAt && Number(item.updatedAt) + timeWindowMs < Date.now()) {
      return false
    }
    return true
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
    const txResponse: providers.TransactionResponse = await this.mutex.runExclusive(async () => {
      const id = uuidv4()
      const logger = this.logger.create({ id })
      logger.debug(`in-memory count: ${this._count}`)
      logger.debug(`unlocked tx: ${JSON.stringify(tx)}`)
      this._count++
      return await this._sendTransaction(tx, id)
    })

    // TODO: waits should be handled outside of this class
    await txResponse.wait()
    return txResponse
  }

  private async _sendTransaction (tx: providers.TransactionRequest, id: string): Promise<providers.TransactionResponse> {
    const _timeId = `GasBoostTransaction elapsed ${id} `
    console.time(_timeId)
    const logger = this.logger.create({ id })
    // logger.debug('_sendTransaction getDbNonce start')
    tx.nonce = await this.getDbNonce()
    // logger.debug('_sendTransaction getDbNonce done')
    const gTx = this.gTxFactory.createTransaction(tx, id)
    await gTx.save()
    try {
      logger.debug('_sendTransaction send start')
      await gTx.send()
      logger.debug('_sendTransaction send done')
    } catch (err) {
      // if nonce too low then we still want to increment the tracked nonce
      // before throwing error
      if (err instanceof NonceTooLowError) {
        // logger.debug('_sendTransaction inNonce in catch start')
        await this.incNonce()
        // logger.debug('_sendTransaction inNonce in catch done')
        // logger.debug('_sendTransaction getDbNonce in catch start')
        const newNonce = await this.getDbNonce()
        // logger.debug('_sendTransaction getDbNonce in catch done')
        logger.debug(`increment for NonceTooLowError. new nonce ${newNonce}`)
      }
      throw err
    }
    // logger.debug('_sendTransaction incNonce start')
    await this.incNonce()
    // logger.debug('_sendTransaction incNonce done')
    this.lastTxSentTimestamp = Date.now()
    console.timeEnd(_timeId)
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
    await this.store.update('nonce', {
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

  setInitialTxGasPriceMultiplier (initialTxGasPriceMultiplier: number) {
    this.setOptions({
      initialTxGasPriceMultiplier
    })
  }

  setMaxGasPriceGwei (maxGasPriceGwei: number) {
    this.setOptions({
      maxGasPriceGwei
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
    this.options = options
  }
}

export default GasBoostSigner
