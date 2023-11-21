import { ChainSlug } from '../config/types'

export type Network = {
  name: string
  image: string
  networkId: number
  publicRpcUrl?: string
  fallbackPublicRpcUrls?: string[]
  explorerUrls: string[]
  nativeBridgeUrl?: string
  subgraphUrl?: string
  etherscanApiUrl?: string
  isRollup?: boolean
  isRelayable?: boolean
  txOverrides?: {
    minGasPrice?: number
    minGasLimit?: number
  }
}

export type Networks = Partial<{
  [key in ChainSlug]: Network
}>
