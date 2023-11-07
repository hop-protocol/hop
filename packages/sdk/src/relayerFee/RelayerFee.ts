import { ArbitrumRelayerFee } from './ArbitrumRelayerFee'
import { BigNumber } from 'ethers'
import { Chain } from '../models'
import { LineaRelayerFee } from './LineaRelayerFee'

import { NetworkSlug } from '../constants'

const RelayerFees = {
  [Chain.Arbitrum.slug]: ArbitrumRelayerFee,
  [Chain.Nova.slug]: ArbitrumRelayerFee,
  [Chain.Linea.slug]: LineaRelayerFee
}

// Returns data in ETH

class RelayerFee {
  async getRelayCost (network: string, chainSlug: string, token: string): Promise<BigNumber> {
    if (!RelayerFees[chainSlug]) {
      return BigNumber.from('0')
    }

    return (new RelayerFees[chainSlug](network, chainSlug, token)).getRelayCost()
  }
}

export default RelayerFee
