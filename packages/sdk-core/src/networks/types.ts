import { ChainSlug } from '../config/types.js'

export type Network = {
  name: string
  image: string
  networkId: number
  publicRpcUrl: string
  fallbackPublicRpcUrls?: string[]
  explorerUrls: string[]
  nativeBridgeUrl?: string
  subgraphUrl?: string
  etherscanApiUrl?: string
  isRollup?: boolean
  isRelayable?: boolean
  multicall?: string
  averageBlockTimeSeconds?: number
  oruExitTimeSeconds?: number
  txOverrides?: {
    minGasPrice?: number
    minGasLimit?: number
  }
}

export type Networks = Partial<{
  [key in ChainSlug]: Network
}>
