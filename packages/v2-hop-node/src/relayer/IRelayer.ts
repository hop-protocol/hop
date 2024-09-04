export interface IRelayer {
  // Initialization
  start (): void

  relay <T>(relayItem: T): Promise<void>
}
