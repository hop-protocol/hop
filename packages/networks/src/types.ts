export interface Network {
  networkId: number
  rpcUrls: string[]
  explorerUrls: string[]
}

export interface Networks {
  [key: string]: Network
}
