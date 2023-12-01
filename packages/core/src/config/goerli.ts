import { Config } from './types'

export const config : Config = {
  bonderFeeBps: {
    ETH: {
      ethereum: 500,
      polygon: 500,
      gnosis: 500,
      optimism: 500,
      zksync: 500,
      linea: 500,
      scrollzk: 500,
      base: 500,
      polygonzk: 500
    },
    HOP: {
      ethereum: 500,
      polygon: 500,
      gnosis: 500,
      optimism: 500,
      zksync: 500,
      linea: 500,
      scrollzk: 500,
      base: 500
    },
    USDC: {
      ethereum: 500,
      polygon: 500,
      gnosis: 500,
      optimism: 500,
      zksync: 500,
      linea: 500,
      scrollzk: 500,
      base: 500
    },
    USDT: {
      ethereum: 500,
      polygon: 500,
      optimism: 500,
      zksync: 500,
      linea: 500,
      scrollzk: 500,
      base: 500
    },
    DAI: {
      ethereum: 500,
      polygon: 500,
      optimism: 500,
      zksync: 500,
      linea: 500,
      scrollzk: 500,
      base: 500
    },
    UNI: {
      ethereum: 500,
      polygon: 500,
      optimism: 500,
      zksync: 500,
      linea: 500,
      scrollzk: 500,
      base: 500
    }
  },
  bonderTotalStake: {
    ETH: 1000,
    HOP: 100,
    USDC: 100,
    USDT: 100,
    DAI: 100,
    UNI: 100
  },
  destinationFeeGasPriceMultiplier: 1.2,
  relayerFeeEnabled: {
    polygon: false,
    optimism: false,
    arbitrum: false,
    zksync: false,
    linea: false,
    scrollzk: false,
    base: false,
    polygonzk: false
  },
  relayerFeeWei: {
    linea: '100000000000000'
  },
  proxyEnabled: {
    ETH: {
      ethereum: false,
      polygon: false,
      gnosis: false,
      optimism: false,
      zksync: false,
      linea: false,
      scrollzk: false,
      base: false,
      polygonzk: false
    },
    HOP: {
      ethereum: false,
      polygon: false,
      gnosis: false,
      optimism: false,
      zksync: false,
      linea: false,
      scrollzk: false,
      base: false
    },
    USDC: {
      ethereum: false,
      polygon: false,
      gnosis: false,
      optimism: false,
      zksync: false,
      linea: false,
      scrollzk: false,
      base: false
    },
    USDT: {
      ethereum: false,
      polygon: false,
      optimism: false,
      zksync: false,
      linea: false,
      scrollzk: false,
      base: false
    },
    DAI: {
      ethereum: false,
      polygon: false,
      optimism: false,
      zksync: false,
      linea: false,
      scrollzk: false,
      base: false
    },
    UNI: {
      ethereum: false,
      polygon: false,
      optimism: false,
      zksync: false,
      linea: false,
      scrollzk: false,
      base: false
    }
  },
  bridgeDeprecated: {
    USDC: true
  },
  defaultSendGasLimit: {
    native: {
      ethereum: 130000,
      optimism: 225000,
      gnosis: 260000,
      polygon: 260000,
      linea: 500000,
      scrollzk: 500000,
      base: 225000,
      polygonzk: 500000
    },
    token: {
      ethereum: 180000,
      optimism: 240000,
      gnosis: 260000,
      polygon: 260000,
      linea: 700000,
      scrollzk: 700000,
      base: 240000,
      polygonzk: 700000
    }
  }
}
