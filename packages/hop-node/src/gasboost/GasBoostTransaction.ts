import Logger from 'src/logger'
import MemoryStore from './MemoryStore'
import Store from './Store'
import { BigNumber, Signer, providers, utils } from 'ethers'
import { EventEmitter } from 'events'
import { boundClass } from 'autobind-decorator'
import { chainSlugToId, getBumpedGasPrice, getProviderChainSlug, wait } from 'src/utils'
import { v4 as uuidv4 } from 'uuid'

export enum State {
  Confirmed = 'confirmed',
  Boosted = 'boosted',
  Error = 'error'
}

type InflightItem = {
  hash?: string
  boosted: boolean
  sentAt: number
  confirmed: boolean
}

type MarshalledItem = {
  id: string
  createdAt: number
  txHash: string
  from: string
  to: string
  data: string
  value: string
  nonce: number
  gasPrice: string
  gasLimit: string
}

export type Options = {
  pollMs: number
  timeTilBoostMs: number
  gasPriceMultiplier: number
  maxGasPriceGwei: number
  compareMarketGasPrice: boolean
}

@boundClass
class GasBoostTransaction extends EventEmitter implements providers.TransactionResponse {
  started: boolean = false
  pollMs: number = 10 * 1000
  timeTilBoostMs: number = 1 * 60 * 1000
  gasPriceMultiplier: number = 1.5
  maxGasPriceGwei: number = 500
  compareMarketGasPrice: boolean = true
  boostIndex: number = 0
  inflightItems: InflightItem[] = []
  signer: Signer
  store: Store = new MemoryStore()
  logger: Logger
  chainSlug: string
  id: string
  createdAt: number
  txHash: string

  // these properties are required by ethers TransactionResponse interface
  from: string
  to: string
  data: string
  value: BigNumber
  nonce: number
  gasLimit: BigNumber
  gasPrice: BigNumber
  chainId: number
  confirmations: number = 0

  constructor (tx: providers.TransactionRequest, signer: Signer, store?: Store, options: Partial<Options> = {}) {
    super()
    this.signer = signer
    if (store) {
      this.store = store
    }
    this.id = uuidv4()
    this.createdAt = Date.now()
    this.from = tx.from
    this.to = tx.to
    if (tx.data) {
      this.data = tx.data.toString()
    }
    if (tx.value) {
      this.value = BigNumber.from(tx.value.toString())
    }
    if (tx.nonce) {
      this.nonce = Number(tx.nonce.toString())
    }
    if (tx.gasPrice) {
      this.gasPrice = BigNumber.from(tx.gasPrice.toString())
    }
    if (tx.gasLimit) {
      this.gasLimit = BigNumber.from(tx.gasLimit.toString())
    }

    this.setOptions(options)

    const chainSlug = getProviderChainSlug(this.signer.provider)
    if (!chainSlug) {
      throw new Error('chain slug not found for contract provider')
    }
    this.chainSlug = chainSlug
    this.chainId = chainSlugToId(chainSlug)
    this.logger = new Logger({
      tag: 'GasBoost',
      prefix: `${this.chainSlug} id: ${this.id}`
    })
  }

  get hash ():string {
    if (this.txHash) {
      return this.txHash
    }
    const prevItem = this.getLatestInflightItem()
    if (prevItem) {
      return prevItem.hash
    }
    throw new Error('transaction hash not available yet')
  }

  setPollMs (pollMs: number) {
    this.pollMs = pollMs
  }

  setTimeTilBoostMs (timeTilBoostMs: number) {
    this.timeTilBoostMs = timeTilBoostMs
  }

  setGasPriceMutliplier (gasPriceMultiplier: number) {
    this.gasPriceMultiplier = gasPriceMultiplier
  }

  setMaxGasPriceGwei (maxGasPriceGwei: number) {
    this.maxGasPriceGwei = maxGasPriceGwei
  }

  setCompareMarketGasPrice (compareMarketGasPrice: boolean) {
    this.compareMarketGasPrice = compareMarketGasPrice
  }

  start () {
    this.startPoller()
  }

  async save () {
    await this.store.updateItem(this.id, this.marshal())
  }

  marshal (): MarshalledItem {
    return {
      id: this.id,
      createdAt: this.createdAt,
      txHash: this.txHash,
      from: this.from,
      to: this.to,
      data: this.data,
      value: this.value?.toString(),
      nonce: this.nonce,
      gasPrice: this.gasPrice?.toString(),
      gasLimit: this.gasLimit?.toString()
    }
  }

  static async fromId (id: string, signer: Signer, store: Store, options: Partial<Options> = {}) {
    const item = await store.getItem(id)
    return GasBoostTransaction.unmarshal(item, signer, store, options)
  }

  static async unmarshal (item: MarshalledItem, signer: Signer, store: Store, options: Partial<Options> = {}) {
    const tx = {
      from: item.from,
      to: item.to,
      data: item.data,
      value: item.value,
      nonce: item.nonce,
      gasPrice: item.gasPrice,
      gasLimit: item.gasLimit
    }
    const gTx = new GasBoostTransaction(tx, signer, store)
    gTx.id = item.id
    gTx.createdAt = item.createdAt
    gTx.txHash = item.txHash
    gTx.setOptions(options)
    return gTx
  }

  async send () {
    const nonce = await this.getLatestNonce()
    const gasPrice = this.gasPrice || await this.getBumpedGasPrice()
    const tx = await this._sendTransaction(gasPrice)

    // store populated and normalized values
    this.from = tx.from
    this.to = tx.to
    this.data = tx.data
    this.value = tx.value
    this.gasLimit = tx.gasLimit
    this.gasPrice = tx.gasPrice
    this.nonce = tx.nonce

    this.track(tx)
  }

  async getLatestNonce ():Promise<number> {
    return await this.signer.getTransactionCount('pending')
  }

  async getMarketGasPrice (): Promise<BigNumber> {
    return this.signer.getGasPrice()
  }

  async getBumpedGasPrice (multiplier : number = this.gasPriceMultiplier): Promise<BigNumber> {
    const marketGasPrice = await this.getMarketGasPrice()
    const prevGasPrice = this.gasPrice || marketGasPrice
    const bumpedGasPrice = getBumpedGasPrice(prevGasPrice, multiplier)
    if (!this.compareMarketGasPrice) {
      return bumpedGasPrice
    }
    return marketGasPrice.gt(bumpedGasPrice) ? marketGasPrice : bumpedGasPrice
  }

  getBoostCount (): number {
    return this.boostIndex
  }

  setOptions (options: Partial<Options> = {}): void {
    if (options.pollMs) {
      this.pollMs = options.pollMs
    }
    if (options.timeTilBoostMs) {
      this.timeTilBoostMs = options.timeTilBoostMs
    }
    if (options.gasPriceMultiplier) {
      this.gasPriceMultiplier = options.gasPriceMultiplier
    }
    if (options.maxGasPriceGwei) {
      this.maxGasPriceGwei = options.gasPriceMultiplier
    }
    if (typeof options.compareMarketGasPrice === 'boolean') {
      this.compareMarketGasPrice = options.compareMarketGasPrice
    }
  }

  async wait (): Promise<providers.TransactionReceipt> {
    if (this.txHash) {
      return this.getReceipt(this.txHash)
    }
    for (const { hash } of this.inflightItems) {
      this.getReceipt(hash)
        .then(() => this.handleConfirmation(hash))
    }
    return new Promise((resolve) => {
      this.on(State.Confirmed, (tx) => {
        resolve(tx)
      })
    })
  }

  hasInflightItems (): boolean {
    return this.inflightItems.length > 0
  }

  getInflightItems (): InflightItem[] {
    return this.inflightItems
  }

  getLatestInflightItem (): InflightItem {
    if (this.hasInflightItems()) {
      return this.inflightItems[this.inflightItems.length - 1]
    }
  }

  private async handleConfirmation (txHash: string) {
    if (this.confirmations) {
      return
    }
    this.confirmations = 1
    this.txHash = txHash
    this.clearInflightTxs()
    const tx = await this.signer.provider.getTransaction(txHash)
    this.gasPrice = tx.gasPrice
    const receipt = await this.getReceipt(txHash)
    this.emit(State.Confirmed, receipt)
    this.logger.debug(`confirmed tx: ${tx.hash}, boostIndex: ${this.boostIndex}, nonce: ${this.nonce.toString()}`)
  }

  private async getReceipt (txHash: string) {
    return this.signer.provider.waitForTransaction(txHash)
  }

  private async startPoller () {
    if (this.started) {
      return
    }
    this.started = true
    while (true) {
      await this.poll()
      await wait(this.pollMs)
    }
  }

  private async poll () {
    for (const item of this.inflightItems) {
      await this.handleInflightTx(item)
    }
  }

  private async handleInflightTx (item: InflightItem) {
    if (item.confirmed) {
      this.handleConfirmation(item.hash)
      return
    }
    if (item.boosted) {
      return
    }
    if (!this.shouldBoost(item)) {
      return
    }
    await this.boost(item)
  }

  private shouldBoost (item: InflightItem) {
    return item.sentAt < (Date.now() - this.timeTilBoostMs)
  }

  private async boost (item: InflightItem) {
    const gasPrice = await this.getBumpedGasPrice()
    const maxGasPrice = utils.parseUnits(this.maxGasPriceGwei.toString(), 18)
    if (gasPrice.gt(maxGasPrice)) {
      return
    }
    const tx = await this._sendTransaction(gasPrice)

    this.gasPrice = tx.gasPrice
    this.boostIndex++
    this.track(tx)
    this.emit(State.Boosted, tx, this.boostIndex)
  }

  private async _sendTransaction (gasPrice: BigNumber):Promise<providers.TransactionResponse> {
    const maxRetries = 10
    let i = 0
    while (true) {
      i++
      try {
        if (i > 1) {
          gasPrice = await this.getBumpedGasPrice(this.gasPriceMultiplier * i)
        }

        // await here is intential to catch error below
        return await this.signer.sendTransaction({
          to: this.to,
          data: this.data,
          value: this.value,
          nonce: this.nonce,
          gasPrice,
          gasLimit: this.gasLimit
        })
      } catch (err) {
        const isAlreadyKnown = /AlreadyKnown/gi.test(err.message)
        const isFeeTooLow = /FeeTooLowToCompete/gi.test(err.message)
        const shouldRetry = (isAlreadyKnown || isFeeTooLow) && i < maxRetries
        if (shouldRetry) {
          continue
        }
        throw err
      }
    }
  }

  private track (tx: providers.TransactionResponse) {
    const prevItem = this.getLatestInflightItem()
    if (prevItem) {
      prevItem.boosted = true
      this.logger.debug(`tracking boosted tx: ${tx.hash}, previous tx: ${prevItem.hash}, boostIndex: ${this.boostIndex}, nonce: ${this.nonce.toString()}`)
    } else {
      this.logger.debug(`tracking new tx: ${tx.hash}, nonce: ${this.nonce.toString()}`)
    }
    this.inflightItems.push({
      boosted: false,
      hash: tx.hash,
      sentAt: Date.now(),
      confirmed: false
    })
    tx.wait().then(() => {
      this.handleConfirmation(tx.hash)
    })
      .catch((err: Error) => {
        const isReplacedError = /TRANSACTION_REPLACED/gi.test(err.message)
        if (!isReplacedError) {
          this.emit(State.Error, err)
        }
      })
    this.startPoller()
  }

  private clearInflightTxs () {
    this.inflightItems = []
  }
}

export default GasBoostTransaction
