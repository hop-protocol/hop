export interface RelayChainId {
  relayChainId: string
}

export interface RelayTxContext<RelayTxMethodName> {
  relayChainId: string
  relayTxMethodName: RelayTxMethodName
}
