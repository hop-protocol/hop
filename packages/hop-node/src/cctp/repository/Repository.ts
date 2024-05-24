export abstract class Repository<T, U> {
  // Events
  static readonly ITEM_CREATED: string = 'itemCreated'
  abstract on(event: string, listener: (...args: any[]) => void): void

  // Init
  abstract start (): Promise<void>

  // TODO: Diff U
  // Getters
  abstract getItem(primaryIndex: T, secondaryIndex: U): Promise<U | undefined>
}
