export interface Chain {
  name: string
  chainId: number
  rpcUrl: string
  explorerUrl: string
}

export interface Chains {
  [key: string]: Partial<Chain>
}
