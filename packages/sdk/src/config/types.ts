import { ChainFinalityTag } from '@hop-protocol/core/config'

interface Chain {
  name: string
  chainId: number
  rpcUrl: string
  fallbackRpcUrls?: string[]
  explorerUrl: string
  waitConfirmations: number
  finalityTags: ChainFinalityTag
  subgraphUrl: string
}

export interface Chains {
  [key: string]: Partial<Chain>
}
