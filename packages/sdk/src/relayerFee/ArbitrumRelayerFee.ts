import { BigNumber } from 'ethers'
import { IRelayerFee } from './IRelayerFee'

export class ArbitrumRelayerFee implements IRelayerFee {
  network: string
  token: string
  chain: string

  constructor (network: string, token: string, chain: string) {
    this.network = network
    this.token = token
    this.chain = chain
  }

  async getRelayCost (): Promise<BigNumber> {
    return BigNumber.from(0)
  }
}
