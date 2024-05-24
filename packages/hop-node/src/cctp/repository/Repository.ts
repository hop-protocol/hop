export abstract class Repository<T, U> {
  // Events
  static readonly ITEM_CREATED: string = 'itemCreated'
  abstract on(event: string, listener: (...args: any[]) => void): void

  // Getters
  abstract getItem(state: T, value: U): Promise<U | undefined>
}
