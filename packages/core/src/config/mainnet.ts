import { Config } from './types'

export const config : Config = {
  bonderFeeBps: {
    USDC: {
      ethereum: 7,
      polygon: 7,
      gnosis: 7,
      optimism: 7,
      arbitrum: 7,
      nova: 7
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
      ethereum: 5,
      polygon: 5,
      gnosis: 5,
      optimism: 5,
      arbitrum: 5
    },
    SNX: {
      ethereum: 20
    },
    sUSD: {
      ethereum: 20
    },
    rETH: {
      ethereum: 20,
      optimism: 20,
      arbitrum: 20
    }
  },
  destinationFeeGasPriceMultiplier: 1.2,
  relayerFeeEnabled: {
    polygon: false,
    gnosis: false,
    optimism: false,
    arbitrum: false,
    nova: false,
    zksync: false,
    linea: false,
    scrollzk: false
  }
}
