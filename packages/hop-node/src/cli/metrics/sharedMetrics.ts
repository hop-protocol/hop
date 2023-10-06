import { Chain } from 'src/constants'

export const tokens: Record<string, string> = {
  USDC: 'USDC',
  USDT: 'USDT',
  MATIC: 'MATIC',
  DAI: 'DAI',
  ETH: 'ETH',
  HOP: 'HOP',
  SNX: 'SNX',
  sUSD: 'sUSD',
  ENS: 'ENS',
  WETH: 'WETH',
  WXDAI: 'WXDAI',
  OP: 'OP',
  GNO: 'GNO',
  FRAX: 'FRAX',
  WMATIC: 'WMATIC',
  rETH: 'rETH',
  MAGIC: 'MAGIC',
  SAFE: 'SAFE',
  WBTC: 'WBTC',
  GRT: 'GRT',
}

// blockNumbers and tokenPrice correspond to the end of the year.
// For example, the 2021 object is for 2021-12-31.
export const tokenDataForYear: any = {
  2020: {
    tokenPrice: {
      [tokens.USDC]: 1,
      [tokens.USDT]: 1,
      [tokens.MATIC]: 0.01759143,
      [tokens.DAI]: 1,
      [tokens.ETH]: 738.62,
      [tokens.HOP]: 0,
      [tokens.SNX]: 7.22,
      [tokens.sUSD]: 1,
      [tokens.ENS]: 0,
      [tokens.WETH]: 738.62,
      [tokens.WXDAI]: 1,
      [tokens.OP]: 0,
      [tokens.GNO]: 75.77,
      [tokens.FRAX]: 1,
      [tokens.WMATIC]: 0.01759143,
      [tokens.rETH]: 0,
      [tokens.MAGIC]: 0,
      [tokens.SAFE]: 0,
      [tokens.WBTC]: 28983.10,
      [tokens.GRT]: 0.350831,
    },
    blockNumbers: {
      [Chain.Ethereum]: 11565018,
      [Chain.Gnosis]: 13807934,
      [Chain.Polygon]: 9013758,
      [Chain.Optimism]: 1,
      [Chain.Arbitrum]: 1,
      [Chain.Nova]: 1,
      [Chain.Base]: 1,
    },
    inactiveBridgeTokens: {
      [tokens.ETH]: true,
      [tokens.USDC]: true,
      [tokens.USDT]: true,
      [tokens.DAI]: true,
      [tokens.MATIC]: true,
      [tokens.HOP]: true,
      [tokens.SNX]: true,
      [tokens.sUSD]: true,
      [tokens.rETH]: true,
      [tokens.MAGIC]: true,
    }
  },
  2021: {
    tokenPrice: {
      [tokens.USDC]: 1,
      [tokens.USDT]: 1,
      [tokens.MATIC]: 2.53,
      [tokens.DAI]: 1,
      [tokens.ETH]: 3686.4,
      [tokens.HOP]: 0,
      [tokens.SNX]: 5.5,
      [tokens.sUSD]: 1,
      [tokens.ENS]: 39.08,
      [tokens.WETH]: 3686.4,
      [tokens.WXDAI]: 1,
      [tokens.OP]: 0,
      [tokens.GNO]: 532.35,
      [tokens.FRAX]: 1,
      [tokens.WMATIC]: 2.53,
      [tokens.rETH]: 3752.82,
      [tokens.MAGIC]: 2.25,
      [tokens.SAFE]: 0,
      [tokens.WBTC]: 46346.94,
      [tokens.GRT]: 0.645377,
    },
    blockNumbers: {
      [Chain.Ethereum]: 13916165,
      [Chain.Gnosis]: 19872631,
      [Chain.Polygon]: 23201013,
      [Chain.Optimism]: 1806121,
      [Chain.Arbitrum]: 4221289,
      [Chain.Nova]: 1,
      [Chain.Base]: 1,
    },
    inactiveBridgeTokens: {
      [tokens.rETH]: true,
      [tokens.MAGIC]: true,
    }
  },
  2022: {
    tokenPrice: {
      [tokens.USDC]: 1,
      [tokens.USDT]: 1,
      [tokens.MATIC]: 0.759185,
      [tokens.DAI]: 1,
      [tokens.ETH]: 1196.61,
      [tokens.HOP]: 0.069401,
      [tokens.SNX]: 1.44,
      [tokens.sUSD]: 1,
      [tokens.ENS]: 10.76,
      [tokens.WETH]: 1196.61,
      [tokens.WXDAI]: 1,
      [tokens.OP]: 0.917297,
      [tokens.GNO]: 83.39,
      [tokens.FRAX]: 1,
      [tokens.WMATIC]: 0.759185,
      [tokens.rETH]: 1289.93,
      [tokens.MAGIC]: 0.491041,
      [tokens.SAFE]: 0,
      [tokens.WBTC]: 16530.6,
      [tokens.GRT]: 0.056702,
    },
    blockNumbers: {
      [Chain.Ethereum]: 16308189,
      [Chain.Gnosis]: 25736049,
      [Chain.Polygon]: 37520355,
      [Chain.Optimism]: 58462111,
      [Chain.Arbitrum]: 50084141,
      [Chain.Nova]: 1,
      [Chain.Base]: 1,
    },
    inactiveBridgeTokens: {
      [tokens.rETH]: true,
      [tokens.MAGIC]: true,
    }
  }
}

export const tokenDecimals: Record<string, number> = {
  [tokens.USDC]: 6,
  [tokens.USDT]: 6,
  [tokens.MATIC]: 18,
  [tokens.DAI]: 18,
  [tokens.ETH]: 18,
  [tokens.HOP]: 18,
  [tokens.SNX]: 18,
  [tokens.sUSD]: 18,
  [tokens.ENS]: 18,
  [tokens.WETH]: 18,
  [tokens.WXDAI]: 18,
  [tokens.OP]: 18,
  [tokens.GNO]: 18,
  [tokens.FRAX]: 18,
  [tokens.WMATIC]: 18,
  [tokens.rETH]: 18,
  [tokens.MAGIC]: 18,
  [tokens.SAFE]: 18,
  [tokens.WBTC]: 8,
  [tokens.GRT]: 18,
}

export const networks: string[] = [
  Chain.Ethereum,
  Chain.Gnosis,
  Chain.Polygon,
  Chain.Optimism,
  Chain.Arbitrum,
  Chain.Nova,
  Chain.Base,
]

export const hopAccountAddresses: string[] = [
  // TODO: Get from data source
]

export const coingeckoCoinIds: Record<string, string> = {
  'ETH': 'ethereum',
  'MATIC': 'matic-network'
}

export const possibleYears: number[] = [
  2020,
  2021,
  2022
]