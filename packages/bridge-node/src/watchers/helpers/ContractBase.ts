import { Contract } from 'ethers'
import { EventEmitter } from 'events'

export default class ContractBase extends EventEmitter {
  public providerNetworkId: string

  constructor (contract: Contract) {
    super()
    contract.provider.getNetwork().then(({ chainId }: { chainId: number }) => {
      this.providerNetworkId = chainId.toString()
    })
  }

  get queueGroup () {
    return this.providerNetworkId
  }
}
