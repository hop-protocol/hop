export interface IDataStore<T, U> {
  // Initialization
  start (): void

  // Node events
  on (event: string, listener: (...args: any[]) => void): void

  // Public methods
  // TODO: Diff U
  fetchItem(key: T, value: U): Promise<U>
}