import type { TokenSymbol } from '#tokens/index.js'

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
  readonly name: string
  readonly slug: ChainSlug
  readonly image: string
  readonly nativeTokenSymbol: TokenSymbol
  readonly primaryColor: string
  readonly isL1: boolean
  readonly isRollup: boolean
  readonly isManualRelayOnL2: boolean
  readonly averageBlockTimeMs: number
}

export type SharedChains = {
  readonly [key in ChainSlug]: SharedChain
}

export type Chain = SharedChain & {
  readonly chainId: string
  readonly publicRpcUrl: string
  readonly fallbackPublicRpcUrls: string[]
  readonly explorerUrls: string[]
  readonly subgraphUrl: string
  readonly etherscanApiUrl: string
  readonly multicall: string
  readonly parentChainId: string
  readonly txOverrides: {
    readonly minGasPrice?: number
    readonly minGasLimit?: number
  }
}

export type Chains = Partial<{
  readonly [key in ChainSlug]: Chain
}>

/**
 * Networks
 */

export enum NetworkSlug {
  Mainnet = 'mainnet',
  Goerli = 'goerli',
  Sepolia = 'sepolia'
}

export type Network = {
  readonly slug: NetworkSlug
  readonly isMainnet: boolean
  readonly chains: Chains
}

export type Networks = {
  readonly [key in NetworkSlug]: Network
}
