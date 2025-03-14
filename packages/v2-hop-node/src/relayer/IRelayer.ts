export interface IRelayer<RelayTxMethodName extends string = string> {
  // Initialization
  start (): void

  relay (relayTxMethodName: RelayTxMethodName, relayItem: any, relayChainId: string): Promise<void>
}
