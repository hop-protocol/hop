export type Network = {
  networkId: number
  rpcUrl: string
  explorerUrls: string[]
  waitConfirmations?: number
}

export type Networks = {
  [key: string]: Network
}
