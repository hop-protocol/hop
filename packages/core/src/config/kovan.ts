import { Config } from './types'

export const config : Config = {
  bonderFeeBps: {
    USDC: {
      ethereum: 0,
      xdai: 0,
      optimism: 0,
    },
    ETH: {
      ethereum: 0,
      xdai: 0,
      optimism: 0,
    },
  },
  destinationFeeGasPriceMultiplier: 1
}
