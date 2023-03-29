import { ArbitrumRelayerFee } from './ArbitrumRelayerFee'
import { BigNumber } from 'ethers'
import { Chain } from '../models'
import { LineaRelayerFee } from './LineaRelayerFee'

type RelayChain = ArbitrumRelayerFee | LineaRelayerFee

class RelayerFee {
  relayerFee: {[chain: string]: RelayChain} = {}

  constructor (network: string, token: string) {
    this.relayerFee[Chain.Arbitrum.slug] = new ArbitrumRelayerFee(network, token, Chain.Arbitrum.slug)
    this.relayerFee[Chain.Nova.slug] = new ArbitrumRelayerFee(network, token, Chain.Nova.slug)
    this.relayerFee[Chain.Linea.slug] = new LineaRelayerFee(network, token, Chain.Linea.slug)
  }

  async getRelayCost (chainSlug: string): Promise<BigNumber> {
    return this.relayerFee[chainSlug].getRelayCost()
  }
}

export default RelayerFee
