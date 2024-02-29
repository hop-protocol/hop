import { Chain } from '@hop-protocol/hop-node-core/constants'

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
  GRT: 'GRT'
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
      [tokens.GRT]: 0.350831
    },
    blockNumbers: {
      [Chain.Ethereum]: 11565018,
      [Chain.Gnosis]: 13807934,
      [Chain.Polygon]: 9013758,
      [Chain.Optimism]: 1,
      [Chain.Arbitrum]: 1,
      [Chain.Nova]: 1,
      [Chain.Base]: 1,
      [Chain.Linea]: 1
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
      [tokens.MAGIC]: true
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
      [tokens.GRT]: 0.645377
    },
    blockNumbers: {
      [Chain.Ethereum]: 13916165,
      [Chain.Gnosis]: 19872631,
      [Chain.Polygon]: 23201013,
      [Chain.Optimism]: 1806121,
      [Chain.Arbitrum]: 4221289,
      [Chain.Nova]: 1,
      [Chain.Base]: 1,
      [Chain.Linea]: 1
    },
    inactiveBridgeTokens: {
      [tokens.rETH]: true,
      [tokens.MAGIC]: true
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
      [tokens.GRT]: 0.056702
    },
    blockNumbers: {
      [Chain.Ethereum]: 16308189,
      [Chain.Gnosis]: 25736049,
      [Chain.Polygon]: 37520355,
      [Chain.Optimism]: 58462111,
      [Chain.Arbitrum]: 50084141,
      [Chain.Nova]: 1,
      [Chain.Base]: 1,
      [Chain.Linea]: 1
    },
    inactiveBridgeTokens: {
      [tokens.rETH]: true,
      [tokens.MAGIC]: true
    }
  },
  2023: {
    tokenPrice: {
      [tokens.USDC]: 1,
      [tokens.USDT]: 1,
      [tokens.MATIC]: 0.968677,
      [tokens.DAI]: 1,
      [tokens.ETH]: 2281.67,
      [tokens.HOP]: 0.059217,
      [tokens.SNX]: 3.89,
      [tokens.sUSD]: 1,
      [tokens.ENS]: 9.55,
      [tokens.WETH]: 2281.67,
      [tokens.WXDAI]: 1,
      [tokens.OP]: 3.71,
      [tokens.GNO]: 196.81,
      [tokens.FRAX]: 1,
      [tokens.WMATIC]: 0.968677,
      [tokens.rETH]: 2511.67,
      [tokens.MAGIC]: 1.05,
      [tokens.SAFE]: 0,
      [tokens.WBTC]: 42253.09,
      [tokens.GRT]: 0.188974
    },
    blockNumbers: {
      [Chain.Ethereum]: 18908894,
      [Chain.Gnosis]: 31724129,
      [Chain.Polygon]: 51796221,
      [Chain.Optimism]: 114234210,
      [Chain.Arbitrum]: 165788850,
      [Chain.Nova]: 37302211,
      [Chain.Base]: 8638925,
      [Chain.Linea]: 1459540
    },
    inactiveBridgeTokens: {
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
  [tokens.GRT]: 18
}

export const networks: string[] = [
  Chain.Ethereum,
  Chain.Gnosis,
  Chain.Polygon,
  Chain.Optimism,
  Chain.Arbitrum,
  Chain.Nova,
  Chain.Base,
  Chain.Linea
]

export const hopAccountAddresses: string[] = [
  '0xA80000228CF1a6d4D267Aa7EA2Ba5841d1952d1c',
  '0x5897c788332CD42b5CEc20Fbc61879BA50ab50C1',
  '0xad103c0928aCfde91Dfd4E9E21225bcf9c7cbE62',
  '0x29403201a963A04BC0cDE1aAa1F002BA805F6BFD',
  '0x3217e72e0fE3BFf0e49A81322CD57eB54bb52893',
  '0xF56e305024B195383245A075737d16dBdb8487Fb',
  '0x924AC9910C09A0215b06458653b30471A152022F',
  '0x2A6303e6b99d451Df3566068EBb110708335658f',
  '0xa8866c94Ab7a09a50bfC18370D86F66F4079DE18',
  '0xfEfeC7D3EB14a004029D278393e6AB8B46fb4FCa',
  '0x2615B9e6F4b868cDc2d97d18376b6Aa14c8c0EbA',
  '0x956239d6f4B990926575c14AFD09cDF8B3805a4b',
  '0x1ec078551A5ac8F0f51fAc57Ffc48Ea7d9A86E9d',
  '0x404c2184a4027b0092C5877BC4599099cd63E62D',
  '0x881296Edcb252080bd476c464cEB521d08df7631',
  '0x9f8d2dafE9978268aC7c67966B366d6d55e97f07',
]

export const coingeckoCoinIds: Record<string, string> = {
  ETH: 'ethereum',
  MATIC: 'matic-network'
}

export const possibleYears: number[] = [
  2020,
  2021,
  2022,
  2023
]
