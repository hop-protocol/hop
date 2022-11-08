import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { Block, BlockTag, BlockWithTransactions, Provider as EthersProvider, FeeData, Filter, FilterByBlockHash, Log, TransactionReceipt, TransactionRequest, TransactionResponse } from '@ethersproject/abstract-provider'
import { Deferrable } from '@ethersproject/properties'
import { Network } from '@ethersproject/networks'
import { providers } from 'ethers'
import { rateLimitRetry } from '../utils/rateLimitRetry'

// reference: https://github.com/ethers-io/ethers.js/blob/b1458989761c11bf626591706aa4ce98dae2d6a9/packages/abstract-provider/src.ts/index.ts#L225

export class RetryProvider extends providers.StaticJsonRpcProvider implements EthersProvider {
  async perform (method: string, params: any): Promise<any> {
    return super.perform(method, params)
  }

  // Network
  getNetwork = rateLimitRetry(async (): Promise<Network> => {
    return super.getNetwork()
  })

  // Latest State
  getBlockNumber = rateLimitRetry(async (): Promise<number> => {
    return super.getBlockNumber()
  })

  getGasPrice = rateLimitRetry(async (): Promise<BigNumber> => {
    return super.getGasPrice()
  })

  // Account
  getBalance = rateLimitRetry(async (addressOrName: string | Promise<string>, blockTag?: BlockTag | Promise<BlockTag>): Promise<BigNumber> => {
    return super.getBalance(addressOrName, blockTag)
  })

  getTransactionCount = rateLimitRetry(async (addressOrName: string | Promise<string>, blockTag?: BlockTag | Promise<BlockTag>): Promise<number> => {
    return super.getTransactionCount(addressOrName, blockTag)
  })

  getCode = rateLimitRetry(async (addressOrName: string | Promise<string>, blockTag?: BlockTag | Promise<BlockTag>): Promise<string> => {
    return super.getCode(addressOrName, blockTag)
  })

  getStorageAt = rateLimitRetry(async (addressOrName: string | Promise<string>, position: BigNumberish | Promise<BigNumberish>, blockTag?: BlockTag | Promise<BlockTag>): Promise<string> => {
    return super.getStorageAt(addressOrName, position, blockTag)
  })

  // Execution
  sendTransaction = rateLimitRetry(async (signedTransaction: string | Promise<string>): Promise<TransactionResponse> => {
    return super.sendTransaction(signedTransaction)
  })

  call = rateLimitRetry(async (transaction: Deferrable<TransactionRequest>, blockTag?: BlockTag | Promise<BlockTag>): Promise<string> => {
    return super.call(transaction, blockTag)
  })

  estimateGas = rateLimitRetry(async (transaction: Deferrable<TransactionRequest>): Promise<BigNumber> => {
    return super.estimateGas(transaction)
  })

  // Queries
  getBlock = rateLimitRetry(async (blockHashOrBlockTag: BlockTag | string | Promise<BlockTag | string>): Promise<Block> => {
    return super.getBlock(blockHashOrBlockTag)
  })

  getBlockWithTransactions = rateLimitRetry(async (blockHashOrBlockTag: BlockTag | string | Promise<BlockTag | string>): Promise<BlockWithTransactions> => {
    return super.getBlockWithTransactions(blockHashOrBlockTag)
  })

  getTransaction = rateLimitRetry(async (transactionHash: string | Promise<string>): Promise<TransactionResponse> => {
    return super.getTransaction(transactionHash)
  })

  getTransactionReceipt = rateLimitRetry(async (transactionHash: string | Promise<string>): Promise<TransactionReceipt> => {
    return super.getTransactionReceipt(transactionHash)
  })

  // Bloom-filter Queries
  getLogs = rateLimitRetry(async (filter: Filter | FilterByBlockHash | Promise<Filter | FilterByBlockHash>): Promise<Log[]> => {
    return super.getLogs(filter)
  })

  // ENS
  resolveName = rateLimitRetry(async (name: string | Promise<string>): Promise<null | string> => {
    return super.resolveName(name)
  })

  lookupAddress = rateLimitRetry(async (address: string | Promise<string>): Promise<null | string> => {
    return super.lookupAddress(address)
  })
}

export class FallbackProvider implements EthersProvider {
  providers: EthersProvider[] = []
  activeIndex = 0
  _isProvider: boolean = true

  constructor (providers: any[]) {
    this.providers = providers
  }

  getActiveProvider () {
    return this.providers[this.activeIndex]
  }

  async tryProvider (promise: any) {
    return promise().catch((err: any) => {
      console.log('tryProvider error:', err)
      this.activeIndex = (this.activeIndex + 1) % this.providers.length
      return this.tryProvider(promise)
    })
  }

  // Network
  getNetwork = async (): Promise<Network> => {
    return this.tryProvider(async () => this.getActiveProvider().getNetwork())
  }

  // Latest State
  getBlockNumber = async (): Promise<number> => {
    return this.tryProvider(async () => this.getActiveProvider().getBlockNumber())
  }

  getGasPrice = async (): Promise<BigNumber> => {
    return this.tryProvider(async () => this.getActiveProvider().getGasPrice())
  }

  // Account
  getBalance = async (addressOrName: string | Promise<string>, blockTag?: BlockTag | Promise<BlockTag>): Promise<BigNumber> => {
    return this.tryProvider(async () => this.getActiveProvider().getBalance(addressOrName, blockTag))
  }

  getTransactionCount = async (addressOrName: string | Promise<string>, blockTag?: BlockTag | Promise<BlockTag>): Promise<number> => {
    return this.tryProvider(async () => this.getActiveProvider().getTransactionCount(addressOrName, blockTag))
  }

  getCode = async (addressOrName: string | Promise<string>, blockTag?: BlockTag | Promise<BlockTag>): Promise<string> => {
    return this.tryProvider(async () => this.getActiveProvider().getCode(addressOrName, blockTag))
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

  getFeeData (): Promise<FeeData> {
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
}
