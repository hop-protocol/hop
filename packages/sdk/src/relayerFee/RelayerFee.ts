import { ArbitrumRelayerFee } from './ArbitrumRelayerFee'
import { BigNumber } from 'ethers'
import { Chain } from '../models'

type RelayChain = ArbitrumRelayerFee

class RelayerFee {
  relayerFee: {[chain: string]: RelayChain} = {}

  constructor (network: string, token: string) {
    this.relayerFee[Chain.Arbitrum.slug] = new ArbitrumRelayerFee(network, token)
  }

  async getRelayCost (chainSlug: string): Promise<BigNumber> {
    return this.relayerFee[chainSlug].getRelayCost()
  }
}

export default RelayerFee
