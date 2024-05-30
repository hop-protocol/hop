export abstract class DataStore<T, U> {
  // Events
  static readonly ITEM_CREATED: string = 'itemCreated'
  abstract on(event: string, listener: (...args: any[]) => void): void

  // Init
  abstract init (): Promise<void>
  abstract start (): void

  // TODO: Diff U
  // Getters
  abstract getItem(primaryIndex: T, secondaryIndex: U): Promise<U | undefined>
}
