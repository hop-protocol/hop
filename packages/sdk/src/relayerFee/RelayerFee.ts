import { ArbitrumRelayerFee } from './ArbitrumRelayerFee'
import { BigNumber } from 'ethers'
import { Chain } from '../models'
import { NetworkSlug } from '../constants'

const RelayerFees = {
  [Chain.Arbitrum.slug]: ArbitrumRelayerFee,
  [Chain.Nova.slug]: ArbitrumRelayerFee
}

class RelayerFee {
  async getRelayCost (network: string, chainSlug: string, token: string): Promise<BigNumber> {
    // Relayer fees shouldn't be calculated for non-mainnet chains since some fee calculations rely on chain-specific data
    // that is less useful on testnets. Instead, we use a default value for testnets.
    if (network !== NetworkSlug.Mainnet) {
      if (token === 'ETH') {
        return BigNumber.from(0)
      } else {
        return BigNumber.from('0')
      }
    }

    if (!RelayerFees[chainSlug]) {
      return BigNumber.from(0)
    }

    return BigNumber.from(0)
  }
}

export default RelayerFee
