export interface IDataProvider<T, U> {
  // Initialization
  start (): void
  init (): Promise<void>

  // Node events
  on (event: string, listener: (...args: any[]) => void): void

  // Public methods
  // TODO: Diff U
  fetchItem(key: T, value: U): Promise<U | null>
}