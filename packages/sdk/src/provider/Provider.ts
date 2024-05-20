
import { providers } from 'ethers'
import { getProviderWithFallbacks } from '#utils/getProviderWithFallbacks.js'
import { BigNumber, type BigNumberish } from '@ethersproject/bignumber'
import { Block, BlockTag, BlockWithTransactions, Filter, FilterByBlockHash, Log, TransactionReceipt, TransactionRequest, TransactionResponse } from '@ethersproject/abstract-provider'
import { type Deferrable } from '@ethersproject/properties'
import { type Network } from '@ethersproject/networks'
import { rateLimitRetry } from '#utils/index.js'

export class RetryProvider extends providers.StaticJsonRpcProvider implements providers.Provider {
  override async perform (method: string, params: any): Promise<any> {
    return super.perform(method, params)
  }

  // Network
  override getNetwork = rateLimitRetry(async (): Promise<Network> => {
    return super.getNetwork()
  })

  // Latest State
  override getBlockNumber = rateLimitRetry(async (): Promise<number> => {
    return super.getBlockNumber()
  })

  override getGasPrice = rateLimitRetry(async (): Promise<BigNumber> => {
    return super.getGasPrice()
  })

  // Account
  override getBalance = rateLimitRetry(async (addressOrName: string | Promise<string>, blockTag?: BlockTag | Promise<BlockTag>): Promise<BigNumber> => {
    return super.getBalance(addressOrName, blockTag)
  })

  override getTransactionCount = rateLimitRetry(async (addressOrName: string | Promise<string>, blockTag?: BlockTag | Promise<BlockTag>): Promise<number> => {
    return super.getTransactionCount(addressOrName, blockTag)
  })

  override getCode = rateLimitRetry(async (addressOrName: string | Promise<string>, blockTag?: BlockTag | Promise<BlockTag>): Promise<string> => {
    return super.getCode(addressOrName, blockTag)
  })

  override getStorageAt = rateLimitRetry(async (addressOrName: string | Promise<string>, position: BigNumberish | Promise<BigNumberish>, blockTag?: BlockTag | Promise<BlockTag>): Promise<string> => {
    return super.getStorageAt(addressOrName, position, blockTag)
  })

  // Execution
  override sendTransaction = rateLimitRetry(async (signedTransaction: string | Promise<string>): Promise<TransactionResponse> => {
    return super.sendTransaction(signedTransaction)
  })

  override call = rateLimitRetry(async (transaction: Deferrable<TransactionRequest>, blockTag?: BlockTag | Promise<BlockTag>): Promise<string> => {
    return super.call(transaction, blockTag)
  })

  override estimateGas = rateLimitRetry(async (transaction: Deferrable<TransactionRequest>): Promise<BigNumber> => {
    return super.estimateGas(transaction)
  })

  // Queries
  override getBlock = rateLimitRetry(async (blockHashOrBlockTag: BlockTag | string | Promise<BlockTag | string>): Promise<Block> => {
    return super.getBlock(blockHashOrBlockTag)
  })

  override getBlockWithTransactions = rateLimitRetry(async (blockHashOrBlockTag: BlockTag | string | Promise<BlockTag | string>): Promise<BlockWithTransactions> => {
    return super.getBlockWithTransactions(blockHashOrBlockTag)
  })

  override getTransaction = rateLimitRetry(async (transactionHash: string | Promise<string>): Promise<TransactionResponse> => {
    return super.getTransaction(transactionHash)
  })

  override getTransactionReceipt = rateLimitRetry(async (transactionHash: string | Promise<string>): Promise<TransactionReceipt> => {
    return super.getTransactionReceipt(transactionHash)
  })

  // Bloom-filter Queries
  override getLogs = rateLimitRetry(async (filter: Filter | FilterByBlockHash | Promise<Filter | FilterByBlockHash>): Promise<Log[]> => {
    return super.getLogs(filter)
  })

  // ENS
  override resolveName = rateLimitRetry(async (name: string | Promise<string>): Promise<null | string> => {
    return super.resolveName(name)
  })

  override lookupAddress = rateLimitRetry(async (address: string | Promise<string>): Promise<null | string> => {
    return super.lookupAddress(address)
  })

  override getAvatar = rateLimitRetry(async (nameOrAddress: string): Promise<string> => {
    return (await super.getAvatar(nameOrAddress))!
  })
}


export class FallbackProvider implements providers.Provider {
  private _providersFn: any[] = []
  private _providers: providers.Provider[] = []
  private activeIndex = 0
  _isProvider: boolean = true

  constructor (providers: any[]) {
    this._providersFn = providers
  }

  static fromUrls (urls: string[]): FallbackProvider {
    return getProviderWithFallbacks(urls)
  }

  get providers () {
    return this._providersFn.map((p: any) => {
      if (typeof p === 'function') {
        return p()
      }
      return p
    })
  }

  get connection () {
    return (this.getActiveProvider() as any).connection
  }

  private getActiveProvider (): providers.Provider {
    if (this._providers[this.activeIndex]) {
      return this._providers[this.activeIndex]
    }

    if (typeof this._providersFn[this.activeIndex] === 'function') {
      this._providers[this.activeIndex] = this._providersFn[this.activeIndex]()
    } else {
      this._providers[this.activeIndex] = this._providersFn[this.activeIndex]
    }

    return this._providers[this.activeIndex]
  }

  async tryProvider (fn: any) {
    return fn().catch((err: any) => {
      if (/(noNetwork|rate limit|SERVER_ERROR)/gi.test(err.message)) {
        // console.error('tryProvider error:', err)
        this.activeIndex = (this.activeIndex + 1) % this._providersFn.length
        return fn()
      }
      throw err
    })
  }

  // Network
  getNetwork = async (): Promise<Network> => {
    return this.tryProvider(() => this.getActiveProvider().getNetwork())
  }

  // Latest State
  getBlockNumber = async (): Promise<number> => {
    return this.tryProvider(() => this.getActiveProvider().getBlockNumber())
  }

  getGasPrice = async (): Promise<BigNumber> => {
    return this.tryProvider(() => this.getActiveProvider().getGasPrice())
  }

  // Account
  getBalance = async (addressOrName: string | Promise<string>, blockTag?: BlockTag | Promise<BlockTag>): Promise<BigNumber> => {
    return this.tryProvider(() => this.getActiveProvider().getBalance(addressOrName, blockTag))
  }

  getTransactionCount = async (addressOrName: string | Promise<string>, blockTag?: BlockTag | Promise<BlockTag>): Promise<number> => {
    return this.tryProvider(() => this.getActiveProvider().getTransactionCount(addressOrName, blockTag))
  }

  getCode = async (addressOrName: string | Promise<string>, blockTag?: BlockTag | Promise<BlockTag>): Promise<string> => {
    return this.tryProvider(() => this.getActiveProvider().getCode(addressOrName, blockTag))
  }

  getStorageAt = async (addressOrName: string | Promise<string>, position: BigNumberish | Promise<BigNumberish>, blockTag?: BlockTag | Promise<BlockTag>): Promise<string> => {
    return this.tryProvider(() => this.getActiveProvider().getStorageAt(addressOrName, position, blockTag))
  }

  // Execution
  sendTransaction = async (signedTransaction: string | Promise<string>): Promise<TransactionResponse> => {
    return this.tryProvider(() => this.getActiveProvider().sendTransaction(signedTransaction))
  }

  call = async (transaction: Deferrable<TransactionRequest>, blockTag?: BlockTag | Promise<BlockTag>): Promise<string> => {
    return this.tryProvider(() => this.getActiveProvider().call(transaction, blockTag))
  }

  estimateGas = async (transaction: Deferrable<TransactionRequest>): Promise<BigNumber> => {
    return this.tryProvider(() => this.getActiveProvider().estimateGas(transaction))
  }

  // Queries
  getBlock = async (blockHashOrBlockTag: BlockTag | string | Promise<BlockTag | string>): Promise<Block> => {
    return this.tryProvider(() => this.getActiveProvider().getBlock(blockHashOrBlockTag))
  }

  getBlockWithTransactions = async (blockHashOrBlockTag: BlockTag | string | Promise<BlockTag | string>): Promise<BlockWithTransactions> => {
    return this.tryProvider(() => this.getActiveProvider().getBlockWithTransactions(blockHashOrBlockTag))
  }

  getTransaction = async (transactionHash: string): Promise<TransactionResponse> => {
    return this.tryProvider(() => this.getActiveProvider().getTransaction(transactionHash))
  }

  getTransactionReceipt = async (transactionHash: string): Promise<TransactionReceipt> => {
    return this.tryProvider(() => this.getActiveProvider().getTransactionReceipt(transactionHash))
  }

  // Bloom-filter Queries
  getLogs = async (filter: Filter | FilterByBlockHash): Promise<Log[]> => {
    return this.tryProvider(() => this.getActiveProvider().getLogs(filter))
  }

  // ENS
  resolveName = async (name: string | Promise<string>): Promise<null | string> => {
    return this.tryProvider(() => this.getActiveProvider().resolveName(name))
  }

  lookupAddress = async (address: string | Promise<string>): Promise<null | string> => {
    return this.tryProvider(() => this.getActiveProvider().lookupAddress(address))
  }

  getFeeData (): Promise<any> {
    return this.tryProvider(() => this.getActiveProvider().getFeeData())
  }

  waitForTransaction (transactionHash: string, confirmations?: number, timeout?: number): Promise<TransactionReceipt> {
    return this.getActiveProvider().waitForTransaction(transactionHash, confirmations, timeout)
  }

  on (eventName: string, listener: any): any {
    this.getActiveProvider().on(eventName, listener)
    return this
  }

  once (eventName: string, listener: any): any {
    this.getActiveProvider().once(eventName, listener)
    return this
  }

  emit (eventName: string, ...args: any[]): boolean {
    return this.getActiveProvider().emit(eventName, ...args)
  }

  listenerCount (eventName: string): number {
    return this.getActiveProvider().listenerCount(eventName)
  }

  listeners (eventName: string): any[] {
    return this.getActiveProvider().listeners(eventName)
  }

  off (eventName: string, listener: any): any {
    this.getActiveProvider().off(eventName, listener)
    return this
  }

  removeAllListeners (eventName: string): any {
    this.getActiveProvider().removeAllListeners(eventName)
    return this
  }

  removeListener (eventName: string, listener: any): any {
    this.getActiveProvider().removeListener(eventName, listener)
    return this
  }

  addListener (eventName: string, listener: any): any {
    this.getActiveProvider().addListener(eventName, listener)
    return this
  }

  getAvatar (address: string): Promise<string> {
    return this.tryProvider(() => (this.getActiveProvider() as any).getAvatar(address))
  }

  async detectNetwork (): Promise<Network> {
    return this.tryProvider(() => (this.getActiveProvider() as any).detectNetwork())
  }

  getResolver (address: string): Promise<string> {
    return this.tryProvider(() => (this.getActiveProvider() as any).getResolver(address))
  }
}
