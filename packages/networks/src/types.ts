export interface Network {
  name: string
  networkId: number
  rpcUrls: string[]
  explorerUrls: string[]
  nativeBridgeUrl?: string
}

export interface Networks {
  [key: string]: Network
}
