import { Config } from './types'

export const config : Config = {
  bonderFeeBps: {
    USDC: {
      ethereum: 10,
      polygon: 10,
      gnosis: 10,
      optimism: 10,
      arbitrum: 10,
      nova: 10,
      base: 10
    },
    USDT: {
      ethereum: 20,
      polygon: 20,
      gnosis: 20,
      optimism: 20,
      arbitrum: 20
    },
    DAI: {
      ethereum: 26,
      polygon: 26,
      gnosis: 30,
      optimism: 26,
      arbitrum: 26
    },
    MATIC: {
      ethereum: 5,
      polygon: 5,
      gnosis: 5,
      optimism: 0,
      arbitrum: 0
    },
    ETH: {
      ethereum: 5,
      polygon: 5,
      gnosis: 5,
      optimism: 5,
      arbitrum: 5,
      nova: 5,
      zksync: 5,
      linea: 5,
      scrollzk: 5,
      base: 5
    },
    WBTC: {
      ethereum: 23,
      polygon: 23,
      gnosis: 25,
      optimism: 23,
      arbitrum: 23
    },
    HOP: {
      ethereum: 20,
      polygon: 20,
      gnosis: 20,
      optimism: 20,
      arbitrum: 20,
      nova: 20,
      base: 20
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
    USDC: 2338333,
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
    arbitrum: false,
    nova: false,
    base: false,
    zksync: false,
    linea: true,
    scrollzk: false,
    polygonzk: false
  },
  relayerFeeWei: {
    linea: '1000000000000000'
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
