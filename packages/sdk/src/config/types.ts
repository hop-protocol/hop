interface Chain {
  name: string
  chainId: number
  rpcUrl: string
  fallbackRpcUrls?: string[]
  explorerUrl: string
  waitConfirmations: number
  subgraphUrl: string
}

export interface Chains {
  [key: string]: Partial<Chain>
}
