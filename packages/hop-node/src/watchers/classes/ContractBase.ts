import { Transaction, providers, Contract, BigNumber } from 'ethers'
import { EventEmitter } from 'events'
import { wait, chainIdToSlug, chainSlugToId } from 'src/utils'
import { Chain } from 'src/constants'
import { config } from 'src/config'
import rateLimitRetry from 'src/decorators/rateLimitRetry'

export default class ContractBase extends EventEmitter {
  contract: Contract
  public chainId: number
  public chainSlug: string
  public ready: boolean = false

  constructor (contract: Contract) {
    super()
    this.contract = contract
    if (!this.contract.provider) {
      throw new Error('no provider found for contract')
    }
    this.getChainId()
      .then((chainId: number) => {
        this.chainId = chainId
        this.chainSlug = this.chainIdToSlug(chainId)
        this.ready = true
      })
      .catch(err => {
        console.log(`ContractBase getNetwork() error: ${err.message}`)
      })
  }

  async waitTilReady (): Promise<boolean> {
    if (this.ready) {
      return true
    }

    await wait(100)
    return this.waitTilReady()
  }

  @rateLimitRetry
  async getChainId (): Promise<number> {
    const { chainId } = await this.contract.provider.getNetwork()
    return Number(chainId.toString())
  }

  chainIdToSlug (chainId: number): string {
    return chainIdToSlug(chainId)
  }

  chainSlugToId (chainSlug: string): number {
    return Number(chainSlugToId(chainSlug))
  }

  get queueGroup (): string {
    return this.chainId?.toString()
  }

  get address (): string {
    return this.contract.address
  }

  @rateLimitRetry
  async getTransaction (txHash: string): Promise<Transaction> {
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
  async getBlockTimestamp (blockNumber: string = 'latest'): Promise<number> {
    const block = await this.contract.provider.getBlock(blockNumber)
    return block.timestamp
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
  protected async getBumpedGasPrice (percent: number): Promise<BigNumber> {
    const gasPrice = await this.contract.provider.getGasPrice()
    return gasPrice.mul(BigNumber.from(percent * 100)).div(BigNumber.from(100))
  }

  @rateLimitRetry
  // wait a safe number of confirmations to avoid processing on an uncle block
  async waitSafeConfirmations (): Promise<void> {
    let blockNumber = await this.contract.provider.getBlockNumber()
    const targetBlockNumber = blockNumber + this.waitConfirmations
    while (blockNumber < targetBlockNumber) {
      blockNumber = await this.contract.provider.getBlockNumber()
      await wait(5 * 1000)
    }
  }

  get waitConfirmations () {
    return config.networks?.[this.chainSlug]?.waitSafeConfirmations || 0
  }

  async txOverrides (): Promise<any> {
    const txOptions: any = {}
    // TODO: config option for gas price multiplier
    txOptions.gasPrice = (await this.getBumpedGasPrice(1.5)).toString()
    if (config.isMainnet) {
    } else {
      txOptions.gasLimit = 5000000
      if (this.chainSlug === Chain.Optimism) {
        txOptions.gasPrice = 0
        txOptions.gasLimit = 8000000
      } else if (this.chainSlug === Chain.xDai) {
        txOptions.gasPrice = 50000000000
        txOptions.gasLimit = 5000000
      }
    }
    return txOptions
  }
}
