export type SharedChainConfig = {
  readonly name: string
  readonly slug: string
  readonly image: string
  readonly nativeTokenSymbol: string
  readonly primaryColor: string
  readonly isLayer1: boolean
  readonly isRollup: boolean
  readonly isManualRelayOnL2: boolean
  readonly averageBlockTimeMs: number
}

export type ChainConfig = SharedChainConfig & {
  readonly chainId: string
  readonly rpcUrl: string
  readonly fallbackRpcUrls: string[]
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

/**
 * Networks
 */

export type NetworkConfig = {
  readonly slug: string
  readonly isMainnet: boolean
  readonly chains: Record<string, ChainConfig>
}
