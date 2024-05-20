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
  readonly symbol: TokenSymbolString
  readonly name: string
  readonly decimals: number
  readonly image: string
  readonly coingeckoId: string
  readonly isStableCoin: boolean
}

export type Tokens = {
  readonly [key in TokenSymbol]: Token
}
