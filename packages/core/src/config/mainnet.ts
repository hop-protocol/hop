import { Config } from './types'

export const config : Config = {
  bonderFeeBps: {
    USDC: {
      ethereum: 14,
      polygon: 14,
      gnosis: 25,
      optimism: 14,
      arbitrum: 14
    },
    USDT: {
      ethereum: 26,
      polygon: 26,
      gnosis: 30,
      optimism: 26,
      arbitrum: 26
    },
    DAI: {
      ethereum: 26,
      polygon: 26,
      gnosis: 30,
      optimism: 26,
      arbitrum: 26
    },
    MATIC: {
      ethereum: 20,
      polygon: 20,
      gnosis: 25,
      optimism: 0,
      arbitrum: 0
    },
    ETH: {
      ethereum: 5,
      polygon: 5,
      gnosis: 12,
      optimism: 5,
      arbitrum: 5
    },
    WBTC: {
      ethereum: 23,
      polygon: 23,
      gnosis: 25,
      optimism: 23,
      arbitrum: 23
    }
  },
  destinationFeeGasPriceMultiplier: 1.2
}
