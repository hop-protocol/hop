import { AssetSymbol, ChainSlug } from '../config/types.js'

export interface Token {
  symbol: string
  name: string
  decimals: number
  image: string
  coingeckoId?: string
  isStablecoin?: boolean
}

export type Tokens = {
  [key in AssetSymbol]: Token
} & { ARB: Token } & { XDAI: Token } & { OP: Token } & { GNO: Token } & { RPL: Token } & { MAGIC: Token } & { WETH: Token }

export interface Chain {
  name: string
  slug: string
  image: string
  nativeTokenSymbol: string
  isLayer1: boolean
  primaryColor: string
}

export type Chains = {
  [key in ChainSlug]: Chain
}

export interface Metadata {
  tokens: Tokens
  chains: Chains
}
