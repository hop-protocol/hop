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
  multicall?: string
  averageBlockTimeSeconds?: number
  oruExitTimeSeconds?: number
  timeToIncludeOnL1Seconds?: number
  timeToIncludeOnL2Seconds?: number
  L1ToL2CheckpointTimeInL1Blocks?: number
  txOverrides?: {
    minGasPrice?: number
    minGasLimit?: number
  }
}

export type Networks = Partial<{
  [key in ChainSlug]: Network
}>
