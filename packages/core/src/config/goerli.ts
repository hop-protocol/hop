import { Config } from './types'

export const config : Config = {
  bonderFeeBps: {
    ETH: {
      ethereum: 1,
      polygon: 1,
      gnosis: 1,
      optimism: 1,
      arbitrum: 1
    },
    USDC: {
      ethereum: 1,
      polygon: 1,
      optimism: 1,
      arbitrum: 1
    },
    HOP: {
      ethereum: 1,
      polygon: 1,
      optimism: 1,
      arbitrum: 1
    },
  },
  destinationFeeGasPriceMultiplier: 1,
  relayerFeeEnabled: {
    polygon: false,
    optimism: false,
    arbitrum: false
  }
}