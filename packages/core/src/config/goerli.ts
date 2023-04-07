import { Config } from './types'

export const config : Config = {
  bonderFeeBps: {
    ETH: {
      ethereum: 500,
      polygon: 500,
      gnosis: 500,
      optimism: 500,
      arbitrum: 500,
      zksync: 500,
      linea: 500,
      scrollzk: 500,
      base: 500,
      polygonzk: 500
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
  destinationFeeGasPriceMultiplier: 1.2,
  relayerFeeEnabled: {
    polygon: true,
    optimism: true,
    arbitrum: true,
    zksync: true,
    linea: true,
    scrollzk: true,
    base: true,
    polygonzk: true
  }
}
