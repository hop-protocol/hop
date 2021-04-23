import { Contract } from 'ethers'
import { EventEmitter } from 'events'

export default class ContractBase extends EventEmitter {
  contract: Contract
  public providerNetworkId: string

  constructor (contract: Contract) {
    super()
    this.contract = contract
    if (!this.contract.provider) {
      throw new Error('no provider found for contract')
    }
    this.contract.provider
      .getNetwork()
      .then(({ chainId }: { chainId: number }) => {
        this.providerNetworkId = chainId.toString()
      })
      .catch(err => console.log(`getNetwork() error: ${err.message}`))
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

  get txOverrides () {
    const txOptions: any = {}
    if (this.providerNetworkId === '69') {
      txOptions.gasPrice = 0
      txOptions.gasLimit = 8000000
    }

    return txOptions
  }
}
