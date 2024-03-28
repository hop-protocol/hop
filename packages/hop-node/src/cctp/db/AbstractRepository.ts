import { EventEmitter } from 'node:events'

export abstract class AbstractRepository<T, U> extends EventEmitter {
  // TODO: value U is different than the response U
  // getItems
  // getAllItems
  // getSyncItems

  // Events
  static readonly EVENT_ITEM_CREATED = 'itemAdded'

  // Getters
  abstract getSyncItems(syncMarker: string): AsyncIterable<[string, U, V]>
  abstract getItem(state: T, value: U): Promise<U | undefined>
}