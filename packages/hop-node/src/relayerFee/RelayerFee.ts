import { ArbitrumRelayerFee } from './ArbitrumRelayerFee'
import { BigNumber } from 'ethers'
import { Chain } from 'src/constants'

type RelayChain = ArbitrumRelayerFee

class RelayerFee {
  relayerFee: {[chain: string]: RelayChain} = {}

  constructor () {
    this.relayerFee[Chain.Arbitrum] = new ArbitrumRelayerFee()
  }

  async getRelayCost (chain: string): Promise<BigNumber> {
    return this.relayerFee[chain].getRelayCost()
  }
}

export default RelayerFee
