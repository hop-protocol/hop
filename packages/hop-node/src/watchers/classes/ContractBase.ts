import rateLimitRetry from 'src/decorators/rateLimitRetry'
import { BigNumber, Contract, Transaction, providers } from 'ethers'
import { Chain } from 'src/constants'
import { EventEmitter } from 'events'
import { chainIdToSlug, chainSlugToId, wait } from 'src/utils'
import { config } from 'src/config'

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

  chainIdToSlug (chainId: number): string {
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
      throw new Error('transaction not found')
    }
    return tx.blockNumber
  }

  @rateLimitRetry
  async getBlockTimestamp (
    blockNumber: number | string = 'latest'
  ): Promise<number> {
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
  // wait a safe number of confirmations to avoid processing on a reorg
  async waitSafeConfirmations (blockNumber?: number): Promise<void> {
    const headBlockNumber = await this.contract.provider.getBlockNumber()

    // use latest block number if one is not specified
    if (!blockNumber) {
      blockNumber = headBlockNumber
    }

    // the target block number is the specified block number plus the number
    // of confirmations to wait
    const targetBlockNumber = blockNumber + this.waitConfirmations

    // if latest block number is larger than target block number than there is
    // no need to wait and can return immediately
    if (headBlockNumber > targetBlockNumber) {
      return
    }

    // This number is granular enough to hardly notice a difference when using Hop
    // TODO: wait the min time per chain and then try every 5s (124 * 4 for polygon, for example)
    const waitConfirmationSec = 20
    // keep waiting until latest block number is equal to or larger than
    // target block number
    while (blockNumber < targetBlockNumber) {
      blockNumber = await this.contract.provider.getBlockNumber()
      await wait(waitConfirmationSec * 1000)
    }
  }

  get waitConfirmations () {
    return config.networks?.[this.chainSlug]?.waitConfirmations || 0
  }

  async txOverrides (): Promise<any> {
    const txOptions: any = {}
    // TODO: config option for gas price multiplier
    let multiplier = 1.5
    if (config.isMainnet) {
      // increasing more gas multiplier for xdai
      // to avoid the error "code:-32010, message: FeeTooLowToCompete"
      if (this.chainSlug === Chain.xDai) {
        multiplier = 1.75
      }
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
    txOptions.gasPrice = (await this.getBumpedGasPrice(multiplier)).toString()
    return txOptions
  }
}
