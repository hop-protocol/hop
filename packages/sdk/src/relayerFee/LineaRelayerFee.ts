import { BigNumber, utils as ethersUtils } from 'ethers'
import { IRelayerFee } from './IRelayerFee'

export class LineaRelayerFee implements IRelayerFee {
  network: string
  token: string
  chain: string

  constructor (network: string, token: string, chain: string) {
    this.network = network
    this.token = token
    this.chain = chain
  }

  async getRelayCost (): Promise<BigNumber> {
    const relayCost = ethersUtils.parseEther('0.01')
    return relayCost
  }
}
