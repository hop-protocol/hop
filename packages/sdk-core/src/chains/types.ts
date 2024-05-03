import { type TokenSymbol } from '#tokens/index.js'

// We do not account for different names for the same chain on different ecosystems
// For example, Polygon on Mainnet and Amoy on Sepolia are both called Polygon
export enum ChainSlug {
  Ethereum = 'ethereum',
  Polygon = 'polygon',
  Gnosis = 'gnosis',
  Optimism = 'optimism',
  Arbitrum = 'arbitrum',
  Nova = 'nova',
  ZkSync = 'zksync',
  Linea = 'linea',
  ScrollZk = 'scrollzk',
  Base = 'base',
  PolygonZk = 'polygonzk'
}

interface SharedChain {
  name: string
  slug: ChainSlug
  image: string
  nativeTokenSymbol: TokenSymbol
  primaryColor: string
  isL1: boolean
  isRollup: boolean
  isManualRelayOnL2: boolean
  averageBlockTimeMs: number
}

export type SharedChains = {
  [key in ChainSlug]: SharedChain
}

export type Chain = SharedChain & {
  chainId: string
  publicRpcUrl: string
  fallbackPublicRpcUrls: string[]
  explorerUrls: string[]
  subgraphUrl: string
  etherscanApiUrl: string
  multicall: string
  parentChainId: string
  txOverrides: {
    minGasPrice?: number
    minGasLimit?: number
  }
}

export type Chains = Partial<{
  [key in ChainSlug]: Chain
}>

/**
 * Networks
 */

export enum NetworkSlug {
  Mainnet = 'mainnet',
  Goerli = 'goerli',
  Sepolia = 'sepolia'
}

// Allows for consumption of the enum values as strings without needing `as NetworkSlug`
type NetworkSlugString = typeof NetworkSlug[keyof typeof NetworkSlug]
export type Network = {
  slug: NetworkSlugString
  isMainnet: boolean
  chains: Chains
}

export type Networks = {
  [key in NetworkSlug]: Network
}
