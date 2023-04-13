import { AssetSymbol, ChainSlug } from '../config/types'

export interface Token {
  symbol: string
  name: string
  decimals: number
  image: string
}

export type Tokens = {
  [key in AssetSymbol]: Token
} & { ARB: Token } & { XDAI: Token } & { OP: Token } & { GNO: Token }

export interface Chain {
  name: string
  slug: string
  image: string
  nativeTokenSymbol: string
  isLayer1: boolean
}

export type Chains = {
  [key in ChainSlug]: Chain
}

export interface Metadata {
  tokens: Tokens
  chains: Chains
}
