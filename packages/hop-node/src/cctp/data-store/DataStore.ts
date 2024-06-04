import { EventEmitter } from 'node:events'
import type { LogWithChainId } from '../types.js'
import { DATA_INDEXED_EVENT } from '../indexer/constants.js'
import { IOnchainEventIndexer } from '../indexer/IOnchainEventIndexer.js'

/**
 * @notice This class is not fully abstracted. Indexer and LogWithChainId are
 * implementation details. Make this class more abstract when additional
 * implementations are added.
 */

/**
 * This class is responsible for providing formatted data to the
 * consumer.
 * 
 * This class also emits an event upon receipt of indexed data
 */

export abstract class DataStore<T extends string, U> {
  readonly #eventEmitter: EventEmitter = new EventEmitter()
  readonly #indexer: IOnchainEventIndexer

  constructor (indexer: IOnchainEventIndexer) {
    this.#indexer = indexer
  }

  protected abstract getKeyFromLog(log: LogWithChainId): T
  protected abstract formatItem(key: T, log: LogWithChainId): Promise<U>

  /**
   * Initialization
   */

  start (): void {
    this.#startListeners()
  }

  /**
   * Node events
   */

  #startListeners = (): void => {
    this.#indexer.on(DATA_INDEXED_EVENT, this.#emitIndexedData)
    this.#indexer.on('error', () => { throw new Error('Message data store error') })
  }

  on (event: string, listener: (...args: any[]) => void): void {
    this.#eventEmitter.on(event, listener)
  }

  #emitIndexedData = async (eventLog: LogWithChainId): Promise<void> => {
    const key: T = this.getKeyFromLog(eventLog)
    const formattedEventLog = await this.formatItem(key,eventLog)
    this.#eventEmitter.emit(key, formattedEventLog)
  }

  /**
   * Public methods
   */

  // TODO: Diff U
  // TODO: Value and resp are different IMessage
  async fetchItem(key: T, value: U): Promise<U> {
    const eventLog: LogWithChainId = await this.#indexer.retrieveItem(key, value)
    return this.formatItem(key, eventLog)
  }
}
