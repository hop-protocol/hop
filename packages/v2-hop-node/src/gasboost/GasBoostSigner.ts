import { GasBoostTransactionFactory, type Options } from './GasBoostTransactionFactory.js'
import { Logger } from '#logger/index.js'
import { MemoryStore } from './MemoryStore.js'
import { Mutex } from 'async-mutex'
import { NonceTooLowError } from '#types/error.js'
import { Signer, utils } from 'ethers'
import { v4 as uuidv4 } from 'uuid'
import { wait } from '#utils/wait.js'
import type { Store } from './Store.js'
import type { providers } from 'ethers'
import { GasBoostConfig } from '#config/index.js'

export class GasBoostSigner extends Signer {
  store!: Store
  items: string[] = []
  lastTxSentTimestamp: number = 0
  gTxFactory: GasBoostTransactionFactory
  signer: Signer
  pollMs!: number
  logger: Logger
  mutex: Mutex
  ready: boolean = false
  options!: Partial<Options>
  private _count: number = 0

  constructor (signer: Signer, store: Store = new MemoryStore(), options: Partial<Options> = {}) {
    super()
    this.signer = signer
    utils.defineReadOnly(this, 'provider', signer.provider)
    if (store != null) {
      this.store = store
    }
    this.mutex = new Mutex()
    this.gTxFactory = new GasBoostTransactionFactory(this.signer)
    const tag = 'GasBoostSigner'
    this.logger = new Logger({ tag })
    this.setOptions(options)
    this.init()
      .catch((err: Error) => this.logger.error('init error:', err))
      .finally(() => {
        this.getDbNonce()
          .then((nonce: number) => {
            this.logger.debug('ready')
            this.logger.debug(`current nonce: ${nonce}`)
            this.ready = true
          })
          .catch((err: Error) => {
            this.logger.error('ready error:', err)
            process.exit(1)
          })
      })
  }

  connect (provider: providers.Provider): GasBoostSigner {
    const _signer = this.signer.connect(provider)
    return new GasBoostSigner(_signer, this.store, this.options)
  }

  async getAddress (): Promise<string> {
    return this.signer.getAddress()
  }

  async signMessage (msg: Buffer | string): Promise<string> {
    return this.signer.signMessage(msg)
  }

  async signTransaction (transaction: providers.TransactionRequest): Promise<string> {
    return this.signer.signTransaction(transaction)
  }

  private async init (): Promise<void> {
    // prevent additional bonder instances from overriding db nonce (ie when running separate cli commands)
    const shouldUpdate = await this.shouldSetLatestNonce()
    if (shouldUpdate) {
      await this.setLatestNonce()
    }
  }

  private async shouldSetLatestNonce (): Promise<boolean> {
    const setLatestNonceOnStart = GasBoostConfig.setLatestNonceOnStart
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
    while (true) {
      if (this.ready) {
        return true
      }
      await wait(100)
    }
  }

  private async setLatestNonce (): Promise<void> {
    const onChainNonce = await this.getOnChainNonce()
    await this.setDbNonce(onChainNonce)
  }

  // this is a required ethers Signer method
  override async sendTransaction (tx: providers.TransactionRequest): Promise<providers.TransactionResponse> {
    await this.tilReady()
    const txResponse: providers.TransactionResponse = await this.mutex.runExclusive(async () => {
      const id = uuidv4()
      const logger = this.logger.create({ id })
      logger.debug(`in-memory count: ${this._count}`)
      logger.debug(`unlocked tx: ${JSON.stringify(tx)}`)
      this._count++
      return this._sendTransaction(tx, id)
    })

    // TODO: waits should be handled outside of this class
    await txResponse.wait()
    return txResponse
  }

  private async _sendTransaction (tx: providers.TransactionRequest, id: string): Promise<providers.TransactionResponse> {
    const _timeId = `GasBoostTransaction elapsed ${id} `
    console.time(_timeId)
    const logger = this.logger.create({ id })
    tx.nonce = await this.getDbNonce()
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
        await this.incNonce()
        const newNonce = await this.getDbNonce()
        logger.debug(`increment for NonceTooLowError. new nonce ${newNonce}`)
      }
      throw err
    }
    await this.incNonce()
    this.lastTxSentTimestamp = Date.now()
    console.timeEnd(_timeId)
    return gTx
  }

  async getNonce (): Promise<number> {
    return this.getDbNonce()
  }

  private async getOnChainNonce (): Promise<number> {
    return this.signer.getTransactionCount('pending')
  }

  private async getDbNonce (): Promise<number> {
    const item = await this.store.getItem('nonce')
    return item?.nonce ?? 0
  }

  private async incNonce (): Promise<void> {
    let nonce = await this.getDbNonce()
    nonce++
    await this.setDbNonce(nonce)
  }

  private async setDbNonce (nonce: number): Promise<void> {
    await this.store.update('nonce', {
      nonce,
      updatedAt: Date.now()
    })
  }

  setPollMs (pollMs: number): void {
    this.setOptions({
      pollMs
    })
  }

  setTimeTilBoostMs (timeTilBoostMs: number): void {
    this.setOptions({
      timeTilBoostMs
    })
  }

  setGasPriceMultiplier (gasPriceMultiplier: number): void {
    this.setOptions({
      gasPriceMultiplier
    })
  }

  setInitialTxGasPriceMultiplier (initialTxGasPriceMultiplier: number): void {
    this.setOptions({
      initialTxGasPriceMultiplier
    })
  }

  setMaxGasPriceGwei (maxGasPriceGwei: number): void {
    this.setOptions({
      maxGasPriceGwei
    })
  }

  setPriorityFeePerGasCap (priorityFeePerGasCap: number): void {
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
