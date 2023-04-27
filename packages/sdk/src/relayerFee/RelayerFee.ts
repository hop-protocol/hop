import { ArbitrumRelayerFee } from './ArbitrumRelayerFee'
import { BigNumber } from 'ethers'
import { Chain } from '../models'
import { NetworkSlug } from '../constants'
import { defaultRelayerFeeEth, metadata } from '../config'
import { parseEther, parseUnits } from 'ethers/lib/utils'

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
        return parseEther(defaultRelayerFeeEth)
      } else {
        const { decimals } = metadata.tokens[network][token]
        return parseUnits('1', decimals)
      }
    }

    if (!RelayerFees[chainSlug]) {
      return parseEther(defaultRelayerFeeEth)
    }

    return (new RelayerFees[chainSlug](network, token, chainSlug)).getRelayCost()
  }
}

export default RelayerFee
