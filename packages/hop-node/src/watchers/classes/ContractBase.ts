import chainIdToSlug from 'src/utils/chainIdToSlug'
import chainSlugToId from 'src/utils/chainSlugToId'
import getBumpedGasPrice from 'src/utils/getBumpedGasPrice'
import getProviderChainSlug from 'src/utils/getProviderChainSlug'
import rateLimitRetry from 'src/decorators/rateLimitRetry'
import { BigNumber, Contract, providers } from 'ethers'
import { Chain } from 'src/constants'
import { EventEmitter } from 'events'
import { Transaction } from 'src/types'
import { config as globalConfig } from 'src/config'

export default class ContractBase extends EventEmitter {
  contract: Contract
  public chainId: number
  public chainSlug: Chain

  constructor (contract: Contract) {
    super()
    this.contract = contract
    if (!this.contract.provider) {
      throw new Error('no provider found for contract')
    }
    const chainSlug = getProviderChainSlug(contract.provider)
    if (!chainSlug) {
      throw new Error('chain slug not found for contract provider')
    }
    this.chainSlug = chainSlug
    this.chainId = chainSlugToId(chainSlug)
  }

  @rateLimitRetry
  async getChainId (): Promise<number> {
    if (this.chainId) {
      return this.chainId
    }
    const { chainId } = await this.contract.provider.getNetwork()
    const _chainId = Number(chainId.toString())
    this.chainId = _chainId
    return _chainId
  }

  async getChainSlug () {
    if (this.chainSlug) {
      return this.chainSlug
    }

    const chainId = await this.getChainId()
    const chainSlug = chainIdToSlug(chainId)
    this.chainSlug = chainSlug
    return chainSlug
  }

  chainIdToSlug (chainId: number): Chain {
    return chainIdToSlug(chainId)
  }

  chainSlugToId (chainSlug: string): number {
    return Number(chainSlugToId(chainSlug))
  }

  async getQueueGroup (): Promise<string> {
    return this.getChainSlug()
  }

  get address (): string {
    return this.contract.address
  }

  @rateLimitRetry
  async getTransaction (txHash: string): Promise<Transaction> {
    if (!txHash) {
      throw new Error('tx hash is required')
    }
    return this.contract.provider.getTransaction(txHash)
  }

  @rateLimitRetry
  async getTransactionReceipt (
    txHash: string
  ): Promise<providers.TransactionReceipt> {
    return this.contract.provider.getTransactionReceipt(txHash)
  }

  @rateLimitRetry
  async getBlockNumber (): Promise<number> {
    return this.contract.provider.getBlockNumber()
  }

  @rateLimitRetry
  async getTransactionBlockNumber (txHash: string): Promise<number> {
    const tx = await this.contract.provider.getTransaction(txHash)
    if (!tx) {
      throw new Error(`transaction not found. transactionHash: ${txHash}`)
    }
    return tx.blockNumber
  }

  @rateLimitRetry
  async getBlockTimestamp (
    blockNumber: number | string = 'latest'
  ): Promise<number> {
    const block = await this.contract.provider.getBlock(blockNumber)
    if (!block) {
      throw new Error(`expected block. blockNumber: ${blockNumber}`)
    }
    return block.timestamp
  }

  async getTransactionTimestamp (
    txHash: string
  ): Promise<number> {
    const blockNumber = await this.getTransactionBlockNumber(txHash)
    return this.getBlockTimestamp(blockNumber)
  }

  async getEventTimestamp (event: any): Promise<number> {
    const tx = await event?.getBlock()
    if (!tx) {
      return 0
    }
    if (!tx.timestamp) {
      return 0
    }
    return Number(tx.timestamp.toString())
  }

  @rateLimitRetry
  async getCode (
    address: string,
    blockNumber: string | number = 'latest'
  ): Promise<string> {
    return this.contract.provider.getCode(address, blockNumber)
  }

  @rateLimitRetry
  async getBalance (
    address: string
  ): Promise<BigNumber> {
    return this.contract.provider.getBalance(address)
  }

  @rateLimitRetry
  protected async getGasPrice (): Promise<BigNumber> {
    return this.contract.provider.getGasPrice()
  }

  protected async getBumpedGasPrice (multiplier: number): Promise<BigNumber> {
    const gasPrice = await this.getGasPrice()
    return getBumpedGasPrice(gasPrice, multiplier)
  }

  get waitConfirmations () {
    return globalConfig.networks?.[this.chainSlug]?.waitConfirmations || 0
  }

  async txOverrides (): Promise<any> {
    const txOptions: any = {}
    if (globalConfig.isMainnet) {
      // increasing more gas multiplier for xdai
      // to avoid the error "code:-32010, message: FeeTooLowToCompete"
      if (
        this.chainSlug === Chain.xDai ||
        this.chainSlug === Chain.Polygon
      ) {
        const multiplier = 3
        txOptions.gasPrice = (await this.getBumpedGasPrice(multiplier)).toString()
      }
    } else {
      if (this.chainSlug === Chain.xDai) {
        txOptions.gasPrice = 50_000_000_000
        txOptions.gasLimit = 5_000_000
      } else if (this.chainSlug === Chain.Polygon) {
        txOptions.gasLimit = 5_000_000
      }
    }

    return txOptions
  }
}
