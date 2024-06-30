import { DecodedLogWithContext } from "#types.js"

export interface IOnchainEventIndexer<T, U> {
  // Initialization
  init (): Promise<void>
  start (): void

  // Node events
  on (event: string, listener: (...args: any[]) => void): void

  // Public methods
  retrieveItem(key: T, value: U): Promise<DecodedLogWithContext>
}
