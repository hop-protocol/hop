export type Network = {
  name: string
  networkId: number
  publicRpcUrl?: string
  explorerUrls: string[]
  nativeBridgeUrl?: string
  waitConfirmations: number
}

export type Networks = {
  ethereum: Network
  arbitrum?: Network
  optimism?: Network
  gnosis?: Network
  polygon?: Network
}
