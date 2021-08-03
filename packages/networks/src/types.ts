export interface Network {
  name: string
  networkId: number
  rpcUrls: string[]
  archiveRpcUrls: string[]
  explorerUrls: string[]
  nativeBridgeUrl?: string
  waitConfirmations: number
}

export interface Networks {
  [key: string]: Network
}
