export type Network = {
  name: string
  networkId: number
  rpcUrls: string[]
  explorerUrls: string[]
  nativeBridgeUrl?: string
  waitConfirmations: number
}

export type Networks = {
  ethereum: Network
  arbitrum?: Network
  optimism?: Network
  xdai?: Network
  polygon?: Network
}
