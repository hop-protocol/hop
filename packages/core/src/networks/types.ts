import { ChainSlug, BlockFinalityState } from '../config/types'

export type Network = {
  name: string
  image: string
  networkId: number
  publicRpcUrl?: string
  fallbackPublicRpcUrls?: string[]
  explorerUrls: string[]
  nativeBridgeUrl?: string
  waitConfirmations: number
  finalizationBlockTag?: BlockFinalityState
  subgraphUrl?: string
  etherscanApiUrl?: string
}

export type Networks = Partial<{
  [key in ChainSlug]: Network
}>
