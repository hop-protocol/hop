interface Chain {
  name: string
  chainId: number
  rpcUrl: string
  fallbackRpcUrls?: string[]
  explorerUrl: string
  subgraphUrl: string
  etherscanApiUrl?: string
}

export interface Chains {
  [key: string]: Partial<Chain>
}
