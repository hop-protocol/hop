import type { DecodedLogWithContext, IndexedEventDataWithContext } from "#types/index.js"

export interface IOnchainEventIndexer {
  // Initialization
  init (): Promise<void>
  start (): void

  // Node events
  on (event: string, listener: (...args: any[]) => void): void

  // Public methods
  fetchItem(input: IndexedEventDataWithContext): Promise<DecodedLogWithContext | null>
}
