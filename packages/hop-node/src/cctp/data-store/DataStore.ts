import { EventEmitter } from 'node:events'
import type { DecodedLogWithContext } from '../types.js'
import { DATA_INDEXED_EVENT } from '../indexer/constants.js'
import { IOnchainEventIndexer } from '../indexer/IOnchainEventIndexer.js'
import { IDataStore } from './IDataStore.js'

/**
 * @notice This class is not fully abstracted. Indexer and DecodedLogWithContext are
 * implementation details. Make this class more abstract when additional
 * implementations are added.
 */

/**
 * This class is responsible for providing formatted data to the
 * consumer.
 * 
 * This class also emits an event upon receipt of indexed data
 */

export abstract class DataStore<T extends string, U> implements IDataStore<T, U> {
  readonly #eventEmitter: EventEmitter = new EventEmitter()
  readonly #indexer: IOnchainEventIndexer<T, U>

  abstract fetchItem(key: T, value: U): Promise<U>
  protected abstract getKeyFromLog(log: DecodedLogWithContext): T
  protected abstract formatItem(key: T, log: DecodedLogWithContext): Promise<U>

  constructor (indexer: IOnchainEventIndexer<T, U>) {
    this.#indexer = indexer
  }

  /**
   * Initialization
   */

  async init (): Promise<void> {
    await this.#indexer.init()
    console.log('Data store initialized')
  }

  start (): void {
    this.#startListeners()
    this.#indexer.start()
    console.log('Data store started')
  }

  /**
   * Node events
   */

  #startListeners = (): void => {
    this.#indexer.on(DATA_INDEXED_EVENT, this.#emitIndexedData)
    this.#indexer.on('error', () => { throw new Error('Data store error') })
  }

  on (event: string, listener: (...args: any[]) => void): void {
    this.#eventEmitter.on(event, listener)
  }

  #emitIndexedData = async (eventLog: DecodedLogWithContext): Promise<void> => {
    const key: T = this.getKeyFromLog(eventLog)
    const formattedEventLog = await this.formatItem(key,eventLog)
    this.#eventEmitter.emit(key, formattedEventLog)
  }

  /**
   * Getters
   */

  // TODO: Diff U
  // TODO: Value and resp are different IMessage
  protected async fetchStoredItem<V extends U>(key: T, value: V): Promise<DecodedLogWithContext> {
    return this.#indexer.retrieveItem(key, value)
  }
}
