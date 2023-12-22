import Metrics from 'src/watchers/classes/Metrics'
import fs from 'fs'
import rateLimitRetry from 'src/utils/rateLimitRetry'
import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { Block, BlockTag, BlockWithTransactions, Provider as EthersProvider, Filter, FilterByBlockHash, Log, TransactionReceipt, TransactionRequest, TransactionResponse } from '@ethersproject/abstract-provider'
import { ConnectionInfo } from "@ethersproject/web"
import { Deferrable } from '@ethersproject/properties'
import { Network } from '@ethersproject/networks'
import { monitorProviderCalls } from 'src/config'
import { providers } from 'ethers'

const inMemoryMonitor = false
const calls: Record<string, any> = {}

if (monitorProviderCalls) {
  if (inMemoryMonitor) {
    setInterval(() => {
      fs.writeFileSync('provider_calls.json', JSON.stringify(calls, null, 2))
    }, 5 * 1000)
  }
}

// reference: https://github.com/ethers-io/ethers.js/blob/b1458989761c11bf626591706aa4ce98dae2d6a9/packages/abstract-provider/src.ts/index.ts#L225
export class Provider extends providers.StaticJsonRpcProvider implements EthersProvider {
  metrics: Metrics

  constructor (rpcUrlOrOptions: string | ConnectionInfo) {
    super(rpcUrlOrOptions)
    this.metrics = new Metrics()
  }

  async perform (method: string, params: any): Promise<any> {
    this._monitorRequest(method, params)
    return super.perform(method, params)
  }

  private _monitorRequest (method: string, params: any) {
    if (!monitorProviderCalls) {
      return
    }
    const host = this.connection.url
    if (inMemoryMonitor) {
      if (!calls[host]) {
        calls[host] = {}
      }
      if (!calls[host][method]) {
        calls[host][method] = {}
      }
      if (!calls[host][method][JSON.stringify(params)]) {
        calls[host][method][JSON.stringify(params)] = 0
      }
      calls[host][method][JSON.stringify(params)]++
    }
    this.metrics.setRpcProviderMethod(host, method, params)
  }

  private _trackStackTrace (label: string, stackTrace: string | undefined) {
    const trace = this._parseStackTrace(stackTrace)
    const filtered = trace.filter(x => x.includes('watchers'))[0]
    console.log('TRACE', label, filtered)
  }

  private _parseStackTrace (stackTrace: string | undefined): string[] {
    if (!stackTrace) {
      return []
    }
    return stackTrace?.toString().split('\n').filter(x => x.trim().startsWith('at ')).map(x => x.trim().replace(/.*at /g, ''))
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
    // this._trackStackTrace('getLogs', new Error().stack)
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
