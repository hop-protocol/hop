export type EventContext = {
  chainSlug: string
  chainId: string
  transactionHash: string
  transactionIndex: number
  logIndex: number
  blockNumber: number
  blockTimestamp: number
  from: string
  to: string
  value: string
  nonce: number
  gasLimit: number
  gasUsed: number
  gasPrice: string
  data: string
}

export type EventBase = {
  eventName: string
  eventLog?: any
  context?: EventContext
}
