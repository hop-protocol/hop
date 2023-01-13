import { ArbitrumRelayerFee } from './ArbitrumRelayerFee'
import { BigNumber } from 'ethers'
import { Chain } from '../models'

type RelayChain = ArbitrumRelayerFee

class RelayerFee {
  relayerFee: {[chain: string]: RelayChain} = {}

  constructor (network: string, token: string, chain: string) {
    this.relayerFee[Chain.Arbitrum.slug] = new ArbitrumRelayerFee(network, token, Chain.Arbitrum.slug)
    this.relayerFee[Chain.Nova.slug] = new ArbitrumRelayerFee(network, token, Chain.Nova.slug)
  }

  async getRelayCost (chainSlug: string): Promise<BigNumber> {
    return this.relayerFee[chainSlug].getRelayCost()
  }
}

export default RelayerFee
