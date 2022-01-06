import { Config } from './types'

export const config : Config = {
  bonderFeeBps: {
    USDC: {
      ethereum: 0,
      gnosis: 0,
      optimism: 0
    },
    ETH: {
      ethereum: 0,
      gnosis: 0,
      optimism: 0
    }
  },
  destinationFeeGasPriceMultiplier: 1
}
