import { BigNumber } from 'ethers'
import { IRelayerFee } from './IRelayerFee'

export class LineaRelayerFee implements IRelayerFee {
  network: string
  chain: string
  token: string

  constructor (network: string, chain: string, token: string) {
    this.network = network
    this.chain = chain
    this.token = token
  }

  async getRelayCost (): Promise<BigNumber> {
    return BigNumber.from(0)
  }
}
