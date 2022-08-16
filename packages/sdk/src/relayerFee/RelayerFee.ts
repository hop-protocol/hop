import { ArbitrumRelayerFee } from './ArbitrumRelayerFee'
import { BigNumber } from 'ethers'
import { Chain } from '../models'

type RelayChain = ArbitrumRelayerFee

class RelayerFee {
  relayerFee: {[chain: string]: RelayChain} = {}

  constructor (network: string) {
    this.relayerFee[Chain.Arbitrum.slug] = new ArbitrumRelayerFee(network)
  }

  async getRelayCost (chainSlug: string): Promise<BigNumber> {
    return this.relayerFee[chainSlug].getRelayCost()
  }
}

export default RelayerFee
