export interface Network {
  name: string
  networkId: number
  rpcUrls: string[]
  explorerUrls: string[]
}

export interface Networks {
  [key: string]: Network
}
