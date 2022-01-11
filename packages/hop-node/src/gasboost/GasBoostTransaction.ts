import BNMax from 'src/utils/BNMax'
import BNMin from 'src/utils/BNMin'
import Logger from 'src/logger'
import Store from './Store'
import chainSlugToId from 'src/utils/chainSlugToId'
import getBumpedBN from 'src/utils/getBumpedBN'
import getBumpedGasPrice from 'src/utils/getBumpedGasPrice'
import getProviderChainSlug from 'src/utils/getProviderChainSlug'
import getTransferIdFromCalldata from 'src/utils/getTransferIdFromCalldata'
import wait from 'src/utils/wait'
import { BigNumber, Signer, providers } from 'ethers'
import { Chain, MaxGasPriceMultiplier, MinPriorityFeePerGas, PriorityFeePerGasCap } from 'src/constants'
import { EventEmitter } from 'events'

import { EstimateGasError, NonceTooLowError } from 'src/types/error'
import { Notifier } from 'src/notifier'
import { formatUnits, hexlify, parseUnits } from 'ethers/lib/utils'
import { gasBoostErrorSlackChannel, gasBoostWarnSlackChannel, hostname } from 'src/config'
import { v4 as uuidv4 } from 'uuid'

enum State {
  Confirmed = 'confirmed',
  Boosted = 'boosted',
  MaxGasPriceReached = 'maxGasPriceReached',
  Error = 'error'
}

type InflightItem = {
  hash?: string
  boosted: boolean
  sentAt: number
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

type Type0GasData = {
  gasPrice: BigNumber
}

type Type2GasData = {
  maxFeePerGas: BigNumber
  maxPriorityFeePerGas: BigNumber
}

type GasFeeData = Type0GasData & Type2GasData

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
  store: Store
  logger: Logger
  notifier: Notifier
  chainSlug: string
  id: string
  createdAt: number
  txHash: string
  receipt: providers.TransactionReceipt
  private _is1559Supported: boolean // set to true if EIP-1559 type transactions are supported
  readonly minMultiplier: number = 1.10 // the minimum gas price multiplier that miners will accept for transaction replacements

  // these properties are required by ethers TransactionResponse interface
  from: string // type 0 and 2 tx required property
  to: string // type 0 and 2 tx required property
  data: string // type 0 and 2 tx required property
  value: BigNumber // type 0 and 2 tx required property
  nonce: number // type 0 and 2 tx required property
  gasLimit: BigNumber // type 0 and 2 tx required property
  gasPrice: BigNumber // type 0 tx required property
  maxFeePerGas: BigNumber // type 2 tx required property
  maxPriorityFeePerGas: BigNumber // type 2 tx required property
  chainId: number // type 0 and 2 tx required property
  confirmations: number = 0 // type 0 and 2 tx required property

  constructor (tx: providers.TransactionRequest, signer: Signer, store?: Store, options: Partial<Options> = {}) {
    super()
    this.signer = signer
    if (store != null) {
      this.store = store
    }
    this.createdAt = Date.now()
    this.from = tx.from!
    this.to = tx.to!
    if (tx.data) {
      this.data = hexlify(tx.data)
    }
    if (tx.value) {
      this.value = BigNumber.from(tx.value)
    }
    if (tx.nonce) {
      this.nonce = BigNumber.from(tx.nonce).toNumber()
    }
    if (tx.gasPrice) {
      this.gasPrice = BigNumber.from(tx.gasPrice)
    } else {
      if (tx.maxFeePerGas) {
        this.maxFeePerGas = BigNumber.from(tx.maxFeePerGas)
      }
      if (tx.maxPriorityFeePerGas) {
        this.maxPriorityFeePerGas = BigNumber.from(tx.maxPriorityFeePerGas)
      }
    }
    if (tx.gasLimit) {
      this.gasLimit = BigNumber.from(tx.gasLimit)
    }

    this.id = this.generateId()
    this.setOptions(options)

    const chainSlug = getProviderChainSlug(this.signer.provider)
    if (!chainSlug) {
      throw new Error('chain slug not found for contract provider')
    }
    this.chainSlug = chainSlug
    this.chainId = chainSlugToId(chainSlug)!
    const tag = 'GasBoostTransaction'
    let prefix = `${this.chainSlug} id: ${this.id}`
    const transferId = this.decodeTransferId()
    if (transferId) {
      prefix = `${prefix} transferId: ${transferId}`
    }
    this.logger = new Logger({
      tag,
      prefix
    })
    this.logger.log('starting log')
    this.notifier = new Notifier(
      `GasBoost, label: ${prefix}, host: ${hostname}`
    )
  }

  generateId (): string {
    return uuidv4()
  }

  decodeTransferId (): string | undefined {
    if (this.data) {
      try {
        if (this.data?.startsWith('0x3d12a85a') || this.data?.startsWith('0x23c452cd')) {
          const transferId = getTransferIdFromCalldata(this.data, this.chainId)
          if (transferId) {
            return transferId
          }
        }
      } catch (err) {
        // noop
      }
    }
  }

  get hash (): string {
    if (this.txHash) {
      return this.txHash
    }
    const prevItem = this.getLatestInflightItem()
    if (prevItem) {
      return prevItem.hash! // eslint-disable-line
    }
    throw new Error('transaction hash not available yet')
  }

  setPollMs (pollMs: number) {
    this.pollMs = pollMs
  }

  setTimeTilBoostMs (timeTilBoostMs: number) {
    this.timeTilBoostMs = timeTilBoostMs
  }

  setGasPriceMultiplier (gasPriceMultiplier: number) {
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
    if (!this.store) {
      return
    }
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
    return await GasBoostTransaction.unmarshal(item, signer, store, options)
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
    let gasFeeData = await this.getBumpedGasFeeData()

    // use passed in tx gas values if they were specified
    if (this.gasPrice) {
      gasFeeData.gasPrice = this.gasPrice
    } else if (this.maxFeePerGas || this.maxPriorityFeePerGas) {
      if (this.maxFeePerGas) {
        gasFeeData.maxFeePerGas = this.maxFeePerGas
      }
      if (this.maxPriorityFeePerGas) {
        gasFeeData.maxPriorityFeePerGas = this.maxPriorityFeePerGas
      }
    }

    // clamp gas values to max if they go over max for initial tx send
    gasFeeData = this.clampMaxGasFeeData(gasFeeData)
    const tx = await this._sendTransaction(gasFeeData)

    // store populated and normalized values
    this.from = tx.from
    this.to = tx.to!
    this.data = tx.data
    this.value = tx.value
    this.gasLimit = tx.gasLimit
    this.gasPrice = tx.gasPrice!
    this.maxFeePerGas = tx.maxFeePerGas!
    this.maxPriorityFeePerGas = tx.maxPriorityFeePerGas!
    this.nonce = tx.nonce

    this.logger.debug(`beginning tracking for ${tx.hash}`)
    this.track(tx)
  }

  async getLatestNonce (): Promise<number> {
    return await this.signer.getTransactionCount('pending')
  }

  async getGasFeeData () {
    return await this.signer.provider!.getFeeData() // eslint-disable-line
  }

  async getMarketGasPrice (): Promise<BigNumber> {
    return await this.signer.getGasPrice()
  }

  async getMarketMaxFeePerGas (): Promise<BigNumber> {
    const { maxFeePerGas } = await this.getGasFeeData()
    return maxFeePerGas! // eslint-disable-line
  }

  async getMarketMaxPriorityFeePerGas (): Promise<BigNumber> {
    const { maxPriorityFeePerGas } = await this.getGasFeeData()
    return maxPriorityFeePerGas! // eslint-disable-line
  }

  getMaxGasPrice () {
    return this.parseGwei(this.maxGasPriceGwei)
  }

  getMinPriorityFeePerGas () {
    return this.parseGwei(this.minPriorityFeePerGas)
  }

  getPriorityFeePerGasCap () {
    return this.parseGwei(this.priorityFeePerGasCap)
  }

  async getBumpedGasPrice (multiplier: number = this.gasPriceMultiplier): Promise<BigNumber> {
    const marketGasPrice = await this.getMarketGasPrice()
    if (!this.isChainGasFeeBumpable()) {
      return marketGasPrice
    }
    const prevGasPrice = this.gasPrice || marketGasPrice
    const bumpedGasPrice = getBumpedGasPrice(prevGasPrice, multiplier)
    if (!this.compareMarketGasPrice) {
      return bumpedGasPrice
    }
    return BNMax(marketGasPrice, bumpedGasPrice)
  }

  async getBumpedMaxPriorityFeePerGas (multiplier: number = this.gasPriceMultiplier): Promise<BigNumber> {
    const marketMaxPriorityFeePerGas = await this.getMarketMaxPriorityFeePerGas()
    if (!this.isChainGasFeeBumpable()) {
      return marketMaxPriorityFeePerGas
    }
    const prevMaxPriorityFeePerGas = this.maxPriorityFeePerGas || marketMaxPriorityFeePerGas
    const minPriorityFeePerGas = this.getMinPriorityFeePerGas()
    let bumpedMaxPriorityFeePerGas = getBumpedBN(prevMaxPriorityFeePerGas, multiplier)
    bumpedMaxPriorityFeePerGas = BNMax(minPriorityFeePerGas, bumpedMaxPriorityFeePerGas)
    if (!this.compareMarketGasPrice) {
      return bumpedMaxPriorityFeePerGas
    }
    return BNMax(marketMaxPriorityFeePerGas, bumpedMaxPriorityFeePerGas)
  }

  async getBumpedGasFeeData (multiplier: number = this.gasPriceMultiplier): Promise<Partial<GasFeeData>> {
    const use1559 = await this.is1559Supported() && !this.gasPrice
    if (use1559) {
      const gasFeeData = await this.getGasFeeData()
      const maxPriorityFeePerGas = await this.getBumpedMaxPriorityFeePerGas(multiplier)
      const maxFeePerGas = gasFeeData.maxFeePerGas!.add(maxPriorityFeePerGas) // eslint-disable-line

      return {
        gasPrice: undefined,
        maxFeePerGas,
        maxPriorityFeePerGas
      }
    }

    return {
      gasPrice: await this.getBumpedGasPrice(multiplier),
      maxFeePerGas: undefined,
      maxPriorityFeePerGas: undefined
    }
  }

  clampMaxGasFeeData (gasFeeData: Partial<GasFeeData>): Partial<GasFeeData> {
    if (gasFeeData.gasPrice != null) {
      const maxGasPrice = this.getMaxGasPrice()
      return {
        gasPrice: BNMin(gasFeeData.gasPrice, maxGasPrice)
      }
    }

    const priorityFeePerGasCap = this.getPriorityFeePerGasCap()
    return {
      maxFeePerGas: gasFeeData.maxFeePerGas,
      maxPriorityFeePerGas: BNMin(gasFeeData.maxPriorityFeePerGas!, priorityFeePerGasCap) // eslint-disable-line
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
      if (options.gasPriceMultiplier !== 1 && options.gasPriceMultiplier < this.minMultiplier) {
        throw new Error(`multiplier must be greater than ${this.minMultiplier}`)
      }
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
    this.logger.debug(`wait() called, tx: ${this.hash}`)
    this.logger.debug(`wait() called, txHash: ${this.txHash}`)
    this.logger.debug(`wait() called, inFlightItems: ${JSON.stringify(this.inflightItems)}`)
    if (this.txHash) {
      return await this.getReceipt(this.txHash)
    }
    for (const { hash } of this.inflightItems) {
      this.getReceipt(hash!)
        .then(async (receipt: providers.TransactionReceipt) => this.handleConfirmation(hash!, receipt))
    }
    return await new Promise((resolve, reject) => {
      this
        .on(State.Confirmed, (tx) => {
          this.logger.debug('state confirmed')
          resolve(tx)
        })
        .on(State.Error, (err) => {
          reject(err)
        })
      const listeners = (this as any)._events
      this.logger.debug(`subscribers: "${State.Confirmed}": ${listeners?.[State.Confirmed]?.length}, "${State.Error}": ${listeners?.[State.Error]?.length}`)
    })
  }

  hasInflightItems (): boolean {
    return this.inflightItems.length > 0
  }

  getInflightItems (): InflightItem[] {
    return this.inflightItems
  }

  getLatestInflightItem (): InflightItem | undefined {
    if (this.hasInflightItems()) {
      return this.inflightItems[this.inflightItems.length - 1]
    }
  }

  private async handleConfirmation (txHash: string, receipt: providers.TransactionReceipt) {
    if (this.confirmations) {
      return
    }
    this.confirmations = 1
    this.txHash = txHash
    this.clearInflightTxs()
    const tx = await this.signer.provider!.getTransaction(txHash) // eslint-disable-line
    this.gasPrice = tx.gasPrice!
    this.maxFeePerGas = tx.maxFeePerGas!
    this.maxPriorityFeePerGas = tx.maxPriorityFeePerGas!
    this.receipt = receipt
    this.emit(State.Confirmed, receipt)
    this.logger.debug(`confirmed tx: ${tx.hash}, boostIndex: ${this.boostIndex}, nonce: ${this.nonce.toString()}, ${this.getGasFeeDataAsString()}`)
  }

  private async getReceipt (txHash: string) {
    return await this.signer.provider!.waitForTransaction(txHash) // eslint-disable-line
  }

  private async startPoller () {
    if (this.started) {
      return
    }
    this.started = true
    while (true) {
      if (this.confirmations) {
        this.logger.debug('ending poller. confirmations found.')
        break
      }
      try {
        await this.poll()
      } catch (err) {
        this._emitError(err)
        this.logger.error(`ending poller. ${err.message}`)
        if (err instanceof NonceTooLowError || err instanceof EstimateGasError) {
          this.logger.error('ending poller. breaking.')
          break
        }
      }
      await wait(this.pollMs)
    }
  }

  private async poll () {
    for (const item of this.inflightItems) {
      await this.handleInflightTx(item)
    }
  }

  private async handleInflightTx (item: InflightItem) {
    if (item.boosted) {
      return
    }
    if (!this.shouldBoost(item)) {
      return
    }
    await this.boost(item)
  }

  private shouldBoost (item: InflightItem) {
    const timeOk = item.sentAt < (Date.now() - this.timeTilBoostMs)
    const isConfirmed = this.confirmations
    const isMaxGasPriceReached = this.maxGasPriceReached
    return timeOk && !isConfirmed && !isMaxGasPriceReached
  }

  private async boost (item: InflightItem) {
    this.logger.debug(`attempting boost with boost index ${this.boostIndex}`)
    const gasFeeData = await this.getBumpedGasFeeData()
    const maxGasPrice = this.getMaxGasPrice()
    const priorityFeePerGasCap = this.getPriorityFeePerGasCap()

    // don't boost if suggested gas is over max
    const isMaxReached = gasFeeData.gasPrice?.gt(maxGasPrice) ?? gasFeeData.maxPriorityFeePerGas?.gt(priorityFeePerGasCap)
    if (isMaxReached) {
      if (!this.maxGasPriceReached) {
        const warnMsg = `max gas price reached. boostedGasFee: (${this.getGasFeeDataAsString(gasFeeData)}, maxGasFee: (gasPrice: ${maxGasPrice}, maxPriorityFeePerGas: ${priorityFeePerGasCap}). cannot boost`
        this.notifier.warn(warnMsg, { channel: gasBoostWarnSlackChannel })
        this.logger.warn(warnMsg)
        this.emit(State.MaxGasPriceReached, gasFeeData.gasPrice, this.boostIndex)
        this.maxGasPriceReached = true
      }
      return
    }
    const tx = await this._sendTransaction(gasFeeData)

    this.gasPrice = tx.gasPrice!
    this.maxFeePerGas = tx.maxFeePerGas!
    this.maxPriorityFeePerGas = tx.maxPriorityFeePerGas!
    this.boostIndex++
    this.track(tx)
    this.emit(State.Boosted, tx, this.boostIndex)
  }

  private async _sendTransaction (gasFeeData: Partial<GasFeeData>): Promise<providers.TransactionResponse> {
    const maxRetries = 10
    let i = 0
    while (true) {
      i++
      try {
        this.logger.debug(`tx index ${i}: sending`)
        if (i > 1) {
          this.logger.debug(`tx index ${i}: retrieving gasFeeData`)
          gasFeeData = await this.getBumpedGasFeeData(this.gasPriceMultiplier * i)
        }

        const payload: providers.TransactionRequest = {
          to: this.to,
          data: this.data,
          value: this.value,
          nonce: this.nonce,
          gasLimit: this.gasLimit
        }

        if (gasFeeData.gasPrice != null) {
          payload.gasPrice = gasFeeData.gasPrice
        } else {
          payload.maxFeePerGas = gasFeeData.maxFeePerGas
          payload.maxPriorityFeePerGas = gasFeeData.maxPriorityFeePerGas
        }

        this.logger.debug(`tx index ${i}: checking for enough funds`)
        await this.checkHasEnoughFunds(payload, gasFeeData)

        this.logger.debug(`tx index ${i}: sending transaction`)
        // await here is intentional to catch error below
        const tx = await this.signer.sendTransaction(payload)

        this.logger.debug(`tx index ${i} completed`)
        return tx
      } catch (err) {
        this.logger.debug(`tx index ${i} error: ${err.message}`)

        const {
          nonceTooLow,
          estimateGasFailed,
          isAlreadyKnown,
          isFeeTooLow
        } = this.parseErrorString(err.message)

        // nonceTooLow error checks must be done first since the following errors can be true while nonce is too low
        if (nonceTooLow) {
          this.logger.error(`nonce ${this.nonce} too low`)
          throw new NonceTooLowError('NonceTooLow')
        } else if (estimateGasFailed) {
          this.logger.error('estimateGas failed')
          throw new EstimateGasError('EstimateGasError')
        }

        const shouldRetry = (isAlreadyKnown || isFeeTooLow) && i < maxRetries
        if (shouldRetry) {
          continue
        }
        throw err
      }
    }
  }

  private async checkHasEnoughFunds (payload: providers.TransactionRequest, gasFeeData: Partial<GasFeeData>) {
    let gasLimit
    try {
      gasLimit = await this.signer.estimateGas(payload)
    } catch (err) {
      throw new Error(`checkHasEnoughFunds estimateGas failed ${err.message}`)
    }
    const ethBalance = await this.signer.getBalance()
    const gasPrice = gasFeeData.gasPrice || gasFeeData.maxFeePerGas // eslint-disable-line @typescript-eslint/prefer-nullish-coalescing
    const gasCost = gasLimit.mul(gasPrice!) // eslint-disable-line
    const warnEthBalance = parseUnits((this.warnEthBalance || 0).toString(), 18)
    const formattedGasCost = formatUnits(gasCost, 18)
    const formattedEthBalance = formatUnits(ethBalance, 18)
    if (ethBalance.lt(gasCost)) {
      const errMsg = `insufficient ETH funds to cover gas cost. Need ${formattedGasCost}, have ${formattedEthBalance}`
      this.notifier.error(errMsg, { channel: gasBoostErrorSlackChannel })
      this.logger.error(errMsg)
      throw new Error(errMsg)
    }
    if (ethBalance.lt(warnEthBalance)) {
      const warnMsg = `ETH balance is running low. Have ${formattedEthBalance}`
      this.logger.warn(warnMsg)
      this.notifier.warn(warnMsg, { channel: gasBoostWarnSlackChannel })
    }
  }

  private track (tx: providers.TransactionResponse) {
    this.logger.debug('tracking')
    const prevItem = this.getLatestInflightItem()
    this.logger.debug(`tracking: prevItem ${JSON.stringify(prevItem)}`)
    if (prevItem) {
      prevItem.boosted = true
      this.logger.debug(`tracking boosted tx: ${tx.hash}, previous tx: ${prevItem.hash}, boostIndex: ${this.boostIndex}, nonce: ${this.nonce.toString()}, ${this.getGasFeeDataAsString()}`)
    } else {
      this.logger.debug(`tracking new tx: ${tx.hash}, nonce: ${this.nonce.toString()}, ${this.getGasFeeDataAsString()}`)
    }
    this.inflightItems.push({
      boosted: false,
      hash: tx.hash,
      sentAt: Date.now()
    })
    this.logger.debug(`tracking: inflightItems${JSON.stringify(this.inflightItems)}`)
    tx.wait().then((receipt: providers.TransactionReceipt) => {
      this.logger.debug(`tracking: wait completed. tx hash ${tx.hash}`)
      this.handleConfirmation(tx.hash, receipt)
    })
      .catch((err: Error) => {
        const isReplacedError = /TRANSACTION_REPLACED/i.test(err.message)
        if (!isReplacedError) {
          this._emitError(err)
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

  private getGasFeeDataAsString (gasFeeData: Partial<GasFeeData> = this) {
    const format = (value?: BigNumber) => (value != null) ? this.formatGwei(value) : null
    const { gasPrice, maxFeePerGas, maxPriorityFeePerGas } = gasFeeData
    return `gasPrice: ${format(gasPrice)}, maxFeePerGas: ${format(maxFeePerGas)}, maxPriorityFeePerGas: ${format(maxPriorityFeePerGas)}`
  }

  async is1559Supported (): Promise<boolean> {
    if (typeof this._is1559Supported === 'boolean') {
      return this._is1559Supported
    }
    const { maxFeePerGas, maxPriorityFeePerGas } = await this.getGasFeeData()
    const isSupported = !!((maxFeePerGas != null) && (maxPriorityFeePerGas != null))
    this._is1559Supported = isSupported
    return isSupported
  }

  isChainGasFeeBumpable () {
    // Optimism gasPrice must be constant; shouldn't be bumped
    if (this.chainSlug === Chain.Optimism) {
      return false
    }

    return true
  }

  // explainer: https://stackoverflow.com/q/35185749/1439168
  private _emitError (err: Error) {
    if (this.listeners(State.Error).length > 0) {
      this.emit(State.Error, err)
    }
  }

  private parseErrorString (errMessage: string) {
    const nonceTooLow = /(nonce.*too low|same nonce|already been used|NONCE_EXPIRED|OldNonce|invalid transaction nonce)/i.test(errMessage)
    const estimateGasFailed = /eth_estimateGas/i.test(errMessage)
    const isAlreadyKnown = /AlreadyKnown/i.test(errMessage)
    const isFeeTooLow = /FeeTooLowToCompete/i.test(errMessage)
    return {
      nonceTooLow,
      estimateGasFailed,
      isAlreadyKnown,
      isFeeTooLow
    }
  }
}

export default GasBoostTransaction
