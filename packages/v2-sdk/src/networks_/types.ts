export type Network = {
  name: string
  chainId: number
  publicRpcUrl: string
  fallbackPublicRpcUrls: string[]
  explorerUrls: string[]
  nativeBridgeUrl?: string
  waitConfirmations: number
}

export type Networks = Record<string, Network>
