import { Config } from './types'

export const config : Config = {
  bonderFeeBps: {
    USDC: {
      ethereum: 12,
      optimism: 12,
      arbitrum: 12
    },
    'USDC.e': {
      ethereum: 12,
      optimism: 12,
      arbitrum: 12
    },
  },
  bonderTotalStake: {
  },
  destinationFeeGasPriceMultiplier: 1.2,
  relayerFeeEnabled: {
  },
  relayerFeeWei: {
  },
  bridgeDeprecated: {
  },
  defaultSendGasLimit: {
    native: {
      ethereum: 130000,
      arbitrum: 500000,
      optimism: 225000,
    },
    token: {
      ethereum: 180000,
      arbitrum: 700000,
      optimism: 240000,
    }
  }
}
