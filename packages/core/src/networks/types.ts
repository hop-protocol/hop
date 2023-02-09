import { ChainSlug } from '../config/types'

export type Network = {
  name: string
  image: string
  networkId: number
  publicRpcUrl?: string
  fallbackPublicRpcUrls?: string[]
  explorerUrls: string[]
  nativeBridgeUrl?: string
  waitConfirmations: number
}

export type Networks = Partial<{
  [key in ChainSlug]: Network
}>
