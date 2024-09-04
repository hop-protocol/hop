export interface IRelayer<RelayItem extends object = object> {
  // Initialization
  start (): void

  relay (relayItem: RelayItem): Promise<void>
}
