export type Network = {
  networkId: number
  rpcUrls: string[]
  explorerUrls: string[]
  waitConfirmations?: number
}

export type Networks = {
  [key: string]: Network
}
