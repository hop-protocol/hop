interface Chain {
  name: string
  chainId: number
  rpcUrl: string
  explorerUrl: string
  waitConfirmations: number
}

export interface Chains {
  [key: string]: Partial<Chain>
}
