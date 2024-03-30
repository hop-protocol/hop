import { Config } from './types.js'

export const config : Config = {
  bonderFeeBps: {
    USDC: {
      ethereum: 12,
      polygon: 12,
      gnosis: 12,
      optimism: 12,
      arbitrum: 12,
      nova: 12,
      base: 12
    },
    'USDC.e': {
      ethereum: 12,
      polygon: 12,
      gnosis: 12,
      optimism: 12,
      arbitrum: 12,
      nova: 12,
      base: 12
    },
    USDT: {
      ethereum: 100,
      polygon: 100,
      gnosis: 100,
      optimism: 100,
      arbitrum: 100
    },
    DAI: {
      ethereum: 35,
      polygon: 35,
      gnosis: 5,
      optimism: 35,
      arbitrum: 35
    },
    MATIC: {
      ethereum: 5,
      polygon: 5,
      gnosis: 5,
      optimism: 0,
      arbitrum: 0
    },
    ETH: {
      ethereum: 4,
      polygon: 4,
      gnosis: 4,
      optimism: 4,
      arbitrum: 4,
      nova: 4,
      zksync: 4,
      linea: 4,
      polygonzk: 8,
      scrollzk: 4,
      base: 4
    },
    WBTC: {
      ethereum: 23,
      polygon: 23,
      gnosis: 25,
      optimism: 23,
      arbitrum: 23
    },
    HOP: {
      ethereum: 5,
      polygon: 20,
      gnosis: 20,
      optimism: 5,
      arbitrum: 5,
      nova: 20,
      base: 20,
      linea: 20,
      polygonzk: 20
    },
    SNX: {
      ethereum: 20
    },
    sUSD: {
      ethereum: 20
    },
    rETH: {
      ethereum: 15,
      optimism: 15,
      arbitrum: 15
    },
    MAGIC: {
      ethereum: 20,
      arbitrum: 20,
      nova: 20
    }
  },
  bonderTotalStake: {
    USDC: 0,
    'USDC.e': 2338333,
    USDT: 649805,
    DAI: 1500000,
    MATIC: 766730,
    ETH: 7959,
    HOP: 4500000,
    SNX: 250000,
    sUSD: 400000,
    rETH: 550,
    MAGIC: 1000000
  },
  destinationFeeGasPriceMultiplier: 1.3,
  relayerFeeEnabled: {
    polygon: false,
    gnosis: false,
    optimism: false,
    arbitrum: true,
    nova: true,
    base: false,
    zksync: false,
    linea: true,
    scrollzk: false,
    polygonzk: true
  },
  relayerFeeWei: {
    linea: '100000000000000',
    nova: '100000000000000',
    arbitrum: '100000000000000',
    polygonzk: '1000000000000000'
  },
  bridgeDeprecated: {
    SNX: true,
    sUSD: true
  },
  defaultSendGasLimit: {
    native: {
      ethereum: 130000,
      arbitrum: 500000,
      optimism: 225000,
      gnosis: 260000,
      polygon: 260000,
      nova: 500000,
      linea: 500000,
      scrollzk: 500000,
      base: 225000,
      polygonzk: 500000
    },
    token: {
      ethereum: 180000,
      arbitrum: 700000,
      optimism: 240000,
      gnosis: 260000,
      polygon: 260000,
      nova: 700000,
      linea: 700000,
      scrollzk: 700000,
      base: 240000,
      polygonzk: 700000
    }
  }
}
