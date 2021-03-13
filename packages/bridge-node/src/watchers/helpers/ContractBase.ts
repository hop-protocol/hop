import { Contract } from 'ethers'
import { EventEmitter } from 'events'

export default class ContractBase extends EventEmitter {
  contract: Contract
  public providerNetworkId: string

  constructor (contract: Contract) {
    super()
    this.contract = contract
    this.contract.provider
      .getNetwork()
      .then(({ chainId }: { chainId: number }) => {
        this.providerNetworkId = chainId.toString()
      })
  }

  get queueGroup () {
    return this.providerNetworkId
  }

  get address () {
    return this.contract.address
  }
}
