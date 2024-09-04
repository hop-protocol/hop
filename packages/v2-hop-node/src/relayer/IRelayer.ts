export interface IRelayer<RelayItem> {
  // Initialization
  start (): void

  relay <T extends RelayItem>(relayItem: T): Promise<void>
}
