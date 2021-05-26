import { Transaction, providers, Contract, BigNumber } from 'ethers'
import { EventEmitter } from 'events'
import { wait, networkIdToSlug } from 'src/utils'
import { Chain } from 'src/constants'
import { config } from 'src/config'

export default class ContractBase extends EventEmitter {
  contract: Contract
  public providerNetworkId: number
  public chainSlug: string

  constructor (contract: Contract) {
    super()
    this.contract = contract
    if (!this.contract.provider) {
      throw new Error('no provider found for contract')
    }
    this.getNetworkId()
      .then((networkId: number) => {
        this.providerNetworkId = networkId
        this.chainSlug = networkIdToSlug(networkId)
      })
      .catch(err => console.log(`getNetwork() error: ${err.message}`))
  }

  async getNetworkId (): Promise<number> {
    const { chainId } = await this.contract.provider.getNetwork()
    return Number(chainId.toString())
  }

  get queueGroup (): string {
    return this.providerNetworkId.toString()
  }

  get address (): string {
    return this.contract.address
  }

  async getTransaction (txHash: string): Promise<Transaction> {
    return this.contract.provider.getTransaction(txHash)
  }

  async getTransactionReceipt (
    txHash: string
  ): Promise<providers.TransactionReceipt> {
    return this.contract.provider.getTransactionReceipt(txHash)
  }

  async getBlockNumber (): Promise<number> {
    return this.contract.provider.getBlockNumber()
  }

  async getBlockTimestamp (blockNumber: string = 'latest'): Promise<number> {
    const block = await this.contract.provider.getBlock(blockNumber)
    return block.timestamp
  }

  protected async getBumpedGasPrice (percent: number): Promise<BigNumber> {
    const gasPrice = await this.contract.provider.getGasPrice()
    return gasPrice.mul(BigNumber.from(percent * 100)).div(BigNumber.from(100))
  }

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
        txOptions.gasLimit = 5000000
      }
    }
    return txOptions
  }
}
