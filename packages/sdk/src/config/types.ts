export interface Chain {
  name: string
  chainId: number
  rpcUrls: string[]
  explorerUrl: string
}

export interface Chains {
  [key: string]: Partial<Chain>
}
