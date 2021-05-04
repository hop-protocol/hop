import { Contract, BigNumber } from 'ethers'
import { EventEmitter } from 'events'
import { wait, networkIdToSlug } from 'src/utils'
import { OPTIMISM, XDAI } from 'src/constants'
import { config } from 'src/config'

export default class ContractBase extends EventEmitter {
  contract: Contract
  public providerNetworkId: string

  constructor (contract: Contract) {
    super()
    this.contract = contract
    if (!this.contract.provider) {
      throw new Error('no provider found for contract')
    }
    this.getNetworkId()
      .then((networkId: string) => {
        this.providerNetworkId = networkId
      })
      .catch(err => console.log(`getNetwork() error: ${err.message}`))
  }

  async getNetworkId () {
    const { chainId } = await this.contract.provider.getNetwork()
    return chainId.toString()
  }

  get queueGroup () {
    return this.providerNetworkId
  }

  get address () {
    return this.contract.address
  }

  async getTransaction (txHash: string) {
    return this.contract.provider.getTransaction(txHash)
  }

  async getBlockNumber () {
    return this.contract.provider.getBlockNumber()
  }

  async getBlockTimestamp () {
    const block = await this.contract.provider.getBlock('latest')
    return block.timestamp
  }

  protected async getBumpedGasPrice (percent: number) {
    const gasPrice = await this.contract.provider.getGasPrice()
    return gasPrice.mul(BigNumber.from(percent * 100)).div(BigNumber.from(100))
  }

  async waitSafeConfirmations () {
    let blockNumber = await this.contract.provider.getBlockNumber()
    const targetBlockNumber = blockNumber + config.safeConfirmations
    while (blockNumber < targetBlockNumber) {
      blockNumber = await this.contract.provider.getBlockNumber()
      await wait(5 * 1000)
    }
  }

  async txOverrides () {
    const txOptions: any = {}
    // TODO: config option for gas price multiplier
    txOptions.gasPrice = (await this.getBumpedGasPrice(1.5)).toString()
    if (config.isMainnet) {
      // TODO
    } else {
      txOptions.gasLimit = 5000000
      const network = networkIdToSlug(this.providerNetworkId)
      if (network === OPTIMISM) {
        txOptions.gasPrice = 0
        txOptions.gasLimit = 8000000
      } else if (network === XDAI) {
        txOptions.gasLimit = 5000000
      }
    }
    return txOptions
  }
}
