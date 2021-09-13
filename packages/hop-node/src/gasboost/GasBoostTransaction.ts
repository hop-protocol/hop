import BNMax from 'src/utils/BNMax'
import Logger from 'src/logger'
import MemoryStore from './MemoryStore'
import Store from './Store'
import chainSlugToId from 'src/utils/chainSlugToId'
import getBumpedBN from 'src/utils/getBumpedBN'
import getBumpedGasPrice from 'src/utils/getBumpedGasPrice'
import getProviderChainSlug from 'src/utils/getProviderChainSlug'
import wait from 'src/utils/wait'
import { BigNumber, Signer, providers } from 'ethers'
import { EventEmitter } from 'events'
import { MaxGasPriceMultiplier, MinPriorityFeePerGas, PriorityFeePerGasCap } from 'src/constants'

import { Notifier } from 'src/notifier'
import { boundClass } from 'autobind-decorator'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { hostname } from 'src/config'
import { v4 as uuidv4 } from 'uuid'

export enum State {
  Confirmed = 'confirmed',
  Boosted = 'boosted',
  MaxGasPriceReached = 'maxGasPriceReached',
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
  maxFeePerGas: string
  maxPriorityFeePerGas: string
  gasLimit: string
}

export type Options = {
  pollMs: number
  timeTilBoostMs: number
  gasPriceMultiplier: number
  maxGasPriceGwei: number
  minPriorityFeePerGas: number
  priorityFeePerGasCap: number
  compareMarketGasPrice: boolean
}

export type GasFeeData = {
  gasPrice: BigNumber
  maxFeePerGas: BigNumber
  maxPriorityFeePerGas: BigNumber
}

@boundClass
class GasBoostTransaction extends EventEmitter implements providers.TransactionResponse {
  started: boolean = false
  pollMs: number = 10 * 1000
  timeTilBoostMs: number = 3 * 60 * 1000
  gasPriceMultiplier: number = MaxGasPriceMultiplier // multiplier for gasPrice
  maxGasPriceGwei: number = 500 // the max we'll keep bumping gasPrice in type 0 txs
  maxGasPriceReached: boolean = false // this is set to true when gasPrice is greater than maxGasPrice
  minPriorityFeePerGas: number = MinPriorityFeePerGas // we use this priorityFeePerGas or the ethers suggestions; which ever one is greater
  priorityFeePerGasCap: number = PriorityFeePerGasCap // this the max we'll keep bumping maxPriorityFeePerGas to in type 2 txs. Since maxPriorityFeePerGas is already a type 2 argument, it uses the term cap instead
  compareMarketGasPrice: boolean = true
  warnEthBalance: number = 0.1 // how low ETH balance of signer must get before we log a warning
  boostIndex: number = 0 // number of times transaction has been boosted
  inflightItems: InflightItem[] = []
  signer: Signer
  store: Store = new MemoryStore()
  logger: Logger
  notifier: Notifier
  chainSlug: string
  id: string
  createdAt: number
  txHash: string
  private _is1559Supported : boolean // set to true if EIP-1559 type transactions are supported

  // these properties are required by ethers TransactionResponse interface
  from: string // type 0 and 2 tx required property
  to: string // type 0 and 2 tx required property
  data: string // type 0 and 2 tx required property
  value: BigNumber // type 0 and 2 tx required property
  nonce: number // type 0 and 2 tx required property
  gasLimit: BigNumber // type 0 and 2 tx required property
  gasPrice: BigNumber // type 0 tx required property
  maxFeePerGas : BigNumber // type 2 tx required property
  maxPriorityFeePerGas : BigNumber // type 2 tx required property
  chainId: number // type 0 and 2 tx required property
  confirmations: number = 0 // type 0 and 2 tx required property

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
    } else {
      if (tx.maxFeePerGas) {
        this.maxFeePerGas = BigNumber.from(tx.maxFeePerGas.toString())
      }
      if (tx.maxPriorityFeePerGas) {
        this.maxPriorityFeePerGas = BigNumber.from(tx.maxPriorityFeePerGas.toString())
      }
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
    const tag = 'GasBoostSigner'
    const prefix = `${this.chainSlug} id: ${this.id}`
    this.logger = new Logger({
      tag,
      prefix
    })
    this.notifier = new Notifier(
      `GasBoost, label: ${prefix}, host: ${hostname}`
    )
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

  setMinPriorityFeePerGas (minPriorityFeePerGas: number) {
    this.minPriorityFeePerGas = minPriorityFeePerGas
  }

  setPriorityFeePerGasCap (priorityFeePerGasCap: number) {
    this.priorityFeePerGasCap = priorityFeePerGasCap
  }

  setCompareMarketGasPrice (compareMarketGasPrice: boolean) {
    this.compareMarketGasPrice = compareMarketGasPrice
  }

  setWarnEthBalance (warnEthBalance: number) {
    this.warnEthBalance = warnEthBalance
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
      maxFeePerGas: this.maxFeePerGas?.toString(),
      maxPriorityFeePerGas: this.maxPriorityFeePerGas?.toString(),
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
      maxFeePerGas: item.maxFeePerGas,
      maxPriorityFeePerGas: item.maxPriorityFeePerGas,
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
    let gasFeeData : Partial<GasFeeData> = {}
    if (this.gasPrice) {
      gasFeeData.gasPrice = this.gasPrice
    } else if (this.maxFeePerGas || this.maxPriorityFeePerGas) {
      if (!this.maxFeePerGas) {
        this.maxFeePerGas = await this.getMarketMaxFeePerGas()
      } else if (!this.maxPriorityFeePerGas) {
        this.maxPriorityFeePerGas = await this.getBumpedMaxPriorityFeePerGas()
      }
      gasFeeData = {
        maxFeePerGas: this.maxFeePerGas,
        maxPriorityFeePerGas: this.maxPriorityFeePerGas
      }
    } else {
      gasFeeData = await this.getBumpedGasFeeData()
    }
    const tx = await this._sendTransaction(gasFeeData)

    // store populated and normalized values
    this.from = tx.from
    this.to = tx.to
    this.data = tx.data
    this.value = tx.value
    this.gasLimit = tx.gasLimit
    this.gasPrice = tx.gasPrice
    this.maxFeePerGas = tx.maxFeePerGas
    this.maxPriorityFeePerGas = tx.maxPriorityFeePerGas
    this.nonce = tx.nonce

    this.track(tx)
  }

  async getLatestNonce ():Promise<number> {
    return await this.signer.getTransactionCount('pending')
  }

  async getGasFeeData () {
    return this.signer.provider.getFeeData()
  }

  async getMarketGasPrice (): Promise<BigNumber> {
    return this.signer.getGasPrice()
  }

  async getMarketMaxFeePerGas (): Promise<BigNumber> {
    const { maxFeePerGas } = await this.getGasFeeData()
    return maxFeePerGas
  }

  async getMarketMaxPriorityFeePerGas (): Promise<BigNumber> {
    const { maxPriorityFeePerGas } = await this.getGasFeeData()
    return maxPriorityFeePerGas
  }

  async getBumpedGasPrice (multiplier : number = this.gasPriceMultiplier): Promise<BigNumber> {
    const marketGasPrice = await this.getMarketGasPrice()
    const prevGasPrice = this.gasPrice || marketGasPrice
    const bumpedGasPrice = getBumpedGasPrice(prevGasPrice, multiplier)
    if (!this.compareMarketGasPrice) {
      return bumpedGasPrice
    }
    return BNMax(marketGasPrice, bumpedGasPrice)
  }

  async getBumpedMaxPriorityFeePerGas (multiplier : number = this.gasPriceMultiplier): Promise<BigNumber> {
    const marketMaxPriorityFeePerGas = await this.getMarketMaxPriorityFeePerGas()
    const prevMaxPriorityFeePerGas = this.maxPriorityFeePerGas || marketMaxPriorityFeePerGas
    const minPriorityFeePerGas = this.parseGwei(this.minPriorityFeePerGas)
    let bumpedMaxPriorityFeePerGas = getBumpedBN(prevMaxPriorityFeePerGas, multiplier)
    bumpedMaxPriorityFeePerGas = BNMax(minPriorityFeePerGas, bumpedMaxPriorityFeePerGas)
    if (!this.compareMarketGasPrice) {
      return bumpedMaxPriorityFeePerGas
    }
    return BNMax(marketMaxPriorityFeePerGas, bumpedMaxPriorityFeePerGas)
  }

  async getBumpedGasFeeData (multiplier : number = this.gasPriceMultiplier): Promise<Partial<GasFeeData>> {
    const use1559 = await this.is1559Supported() && !this.gasPrice
    if (use1559) {
      const gasFeeData = await this.getGasFeeData()
      const maxPriorityFeePerGas = await this.getBumpedMaxPriorityFeePerGas(multiplier)
      const maxFeePerGas = gasFeeData.maxFeePerGas.add(maxPriorityFeePerGas)

      return {
        gasPrice: null,
        maxFeePerGas,
        maxPriorityFeePerGas
      }
    }

    return {
      gasPrice: await this.getBumpedGasPrice(multiplier),
      maxFeePerGas: null,
      maxPriorityFeePerGas: null
    }
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
      this.maxGasPriceGwei = options.maxGasPriceGwei
    }
    if (options.minPriorityFeePerGas) {
      this.minPriorityFeePerGas = options.minPriorityFeePerGas
    }
    if (options.priorityFeePerGasCap) {
      this.priorityFeePerGasCap = options.priorityFeePerGasCap
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
    return new Promise((resolve, reject) => {
      this
        .on(State.Confirmed, (tx) => {
          resolve(tx)
        })
        .on(State.Error, (err) => {
          reject(err)
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
    this.maxFeePerGas = tx.maxFeePerGas
    this.maxPriorityFeePerGas = tx.maxPriorityFeePerGas
    const receipt = await this.getReceipt(txHash)
    this.emit(State.Confirmed, receipt)
    this.logger.debug(`confirmed tx: ${tx.hash}, boostIndex: ${this.boostIndex}, nonce: ${this.nonce.toString()}, ${this.getGasFeeDataAsString()}`)
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
      try {
        await this.poll()
        await wait(this.pollMs)
      } catch (err) {
        this.emit(State.Error, err)
      }
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
    const gasFeeData = await this.getBumpedGasFeeData()
    const maxGasPrice = this.parseGwei(this.maxGasPriceGwei)
    const priorityFeePerGasCap = this.parseGwei(this.priorityFeePerGasCap)
    const isMaxReached = gasFeeData.gasPrice?.gt(maxGasPrice) || gasFeeData.maxPriorityFeePerGas?.gt(priorityFeePerGasCap)
    if (isMaxReached) {
      if (!this.maxGasPriceReached) {
        const warnMsg = `max gas price reached. boostedGasFee: (${this.getGasFeeDataAsString(gasFeeData)}, maxGasFee: (gasPrice: ${this.maxGasPriceGwei}, maxPriorityFeePerGas: ${this.priorityFeePerGasCap}). cannot boost`
        this.notifier.warn(warnMsg)
        this.logger.warn(warnMsg)
        this.emit(State.MaxGasPriceReached, gasFeeData.gasPrice, this.boostIndex)
        this.maxGasPriceReached = true
      }
      return
    }
    const tx = await this._sendTransaction(gasFeeData)

    this.gasPrice = tx.gasPrice
    this.maxFeePerGas = tx.maxFeePerGas
    this.maxPriorityFeePerGas = tx.maxPriorityFeePerGas
    this.boostIndex++
    this.track(tx)
    this.emit(State.Boosted, tx, this.boostIndex)
  }

  private async _sendTransaction (gasFeeData: Partial<GasFeeData>):Promise<providers.TransactionResponse> {
    const maxRetries = 10
    let i = 0
    while (true) {
      i++
      try {
        if (i > 1) {
          gasFeeData = await this.getBumpedGasFeeData(this.gasPriceMultiplier * i)
        }

        const payload: providers.TransactionRequest = {
          to: this.to,
          data: this.data,
          value: this.value,
          nonce: this.nonce,
          gasLimit: this.gasLimit
        }

        if (gasFeeData.gasPrice) {
          payload.gasPrice = gasFeeData.gasPrice
        } else {
          payload.maxFeePerGas = gasFeeData.maxFeePerGas
          payload.maxPriorityFeePerGas = gasFeeData.maxPriorityFeePerGas
        }

        await this.checkHasEnoughFunds(payload, gasFeeData)

        // await here is intential to catch error below
        const tx = await this.signer.sendTransaction(payload)

        return tx
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

  private async checkHasEnoughFunds (payload: providers.TransactionRequest, gasFeeData: Partial<GasFeeData>) {
    const [gasLimit, ethBalance] = await Promise.all([
      this.signer.estimateGas(payload),
      this.signer.getBalance()
    ])
    const gasPrice = gasFeeData.gasPrice || gasFeeData.maxFeePerGas
    const gasCost = gasLimit.mul(gasPrice)
    const warnEthBalance = parseUnits((this.warnEthBalance || 0).toString(), 18)
    const formattedGasCost = formatUnits(gasCost, 18)
    const formattedEthBalance = formatUnits(ethBalance, 18)
    if (ethBalance.lt(gasCost)) {
      const errMsg = `insufficient ETH funds to cover gas cost. Need ${formattedGasCost}, have ${formattedEthBalance}`
      this.notifier.error(errMsg)
      this.logger.error(errMsg)
      throw new Error(errMsg)
    }
    if (ethBalance.lt(warnEthBalance)) {
      const warnMsg = `ETH balance is running low. Have ${formattedEthBalance}`
      this.logger.warn(warnMsg)
      this.notifier.warn(warnMsg)
    }
  }

  private track (tx: providers.TransactionResponse) {
    const prevItem = this.getLatestInflightItem()
    if (prevItem) {
      prevItem.boosted = true
      this.logger.debug(`tracking boosted tx: ${tx.hash}, previous tx: ${prevItem.hash}, boostIndex: ${this.boostIndex}, nonce: ${this.nonce.toString()}, ${this.getGasFeeDataAsString()}`)
    } else {
      this.logger.debug(`tracking new tx: ${tx.hash}, nonce: ${this.nonce.toString()}, ${this.getGasFeeDataAsString()}`)
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

  private parseGwei (value: number) {
    return parseUnits(value.toString(), 9)
  }

  private formatGwei (value: BigNumber) {
    return formatUnits(value.toString(), 9)
  }

  private getGasFeeDataAsString (gasFeeData : Partial<GasFeeData> = this) {
    const format = (value?: BigNumber) => value ? this.formatGwei(value) : null
    const { gasPrice, maxFeePerGas, maxPriorityFeePerGas } = gasFeeData
    return `gasPrice: ${format(gasPrice)}, maxFeePerGas: ${format(maxFeePerGas)}, maxPriorityFeePerGas: ${format(maxPriorityFeePerGas)}`
  }

  async is1559Supported (): Promise<boolean> {
    if (typeof this._is1559Supported === 'boolean') {
      return this._is1559Supported
    }
    const { maxFeePerGas, maxPriorityFeePerGas } = await this.getGasFeeData()
    const isSupported = !!(maxFeePerGas && maxPriorityFeePerGas)
    this._is1559Supported = isSupported
    return isSupported
  }
}

export default GasBoostTransaction
