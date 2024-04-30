export enum TokenSymbol {
  USDC = 'USDC',
  'USDC.e' = 'USDC.e',
  USDT = 'USDT',
  DAI = 'DAI',
  MATIC = 'MATIC',
  ETH = 'ETH',
  WBTC = 'WBTC',
  HOP = 'HOP',
  SNX = 'SNX',
  sUSD = 'sUSD',
  rETH = 'rETH',
  UNI = 'UNI',
  MAGIC = 'MAGIC',
  ARB = 'ARB',
  XDAI = 'XDAI',
  OP = 'OP',
  GNO = 'GNO',
  RPL = 'RPL',
  WETH = 'WETH'
}

export type TokenSymbolish = TokenSymbol | string

// Allows for consumption of the enum values as strings without needing `as TokenName`
type TokenSymbolString = typeof TokenSymbol[keyof typeof TokenSymbol]
export interface Token {
  symbol: TokenSymbolString
  name: string
  decimals: number
  image: string
  coingeckoId: string
  isStablecoin: boolean
}

export type Tokens = {
  [key in TokenSymbol]: Token
}
