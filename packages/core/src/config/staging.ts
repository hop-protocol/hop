import { Config } from './types'

export const config : Config = {
  bonderFeeBps: {
    USDC: {
      ethereum: 14,
      polygon: 14,
      gnosis: 25,
      optimism: 14,
      arbitrum: 14
    }
  },
  bonderTotalStake: {},
  destinationFeeGasPriceMultiplier: 1.2,
  relayerFeeEnabled: {
    polygon: false,
    gnosis: false,
    optimism: false,
    arbitrum: false
  },
  proxyEnabled: {},
  bridgeDeprecated: {}
}
