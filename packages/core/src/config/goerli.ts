import { Config } from './types'

export const config : Config = {
  bonderFeeBps: {
    ETH: {
      ethereum: 5,
      polygon: 5,
      gnosis: 5,
      optimism: 5,
      arbitrum: 5,
      zksync: 5,
      linea: 5,
      scrollzk: 5,
      base: 5
    },
    USDC: {
      ethereum: 5,
      polygon: 5,
      optimism: 5,
      arbitrum: 5
    },
    HOP: {
      ethereum: 5,
      polygon: 5,
      optimism: 5,
      arbitrum: 5
    }
  },
  destinationFeeGasPriceMultiplier: 1,
  relayerFeeEnabled: {
    polygon: false,
    optimism: false,
    arbitrum: false,
    zksync: false,
    linea: false,
    scrollzk: false,
    base: false
  }
}
