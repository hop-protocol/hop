import { EventEmitter } from 'node:events'
import { IDataProvider } from './IDataProvider.js'
// TODO: Imports below here should be abstracted away into a generalized
// data-source module. Do that when there are multiple implementations.
import { DATA_STORED_EVENT } from '../indexer/constants.js'
import { IOnchainEventIndexer } from '../indexer/IOnchainEventIndexer.js'
import type { DecodedLogWithContext } from '../types.js'

/**
 * This class is responsible for providing formatted data to the
 * consumer.
 * 
 * This class also emits an event upon receipt of data from the source.
 */


// TODO: Abstract away these types into a generalized data-source module
// when there are multiple implementations.
type IDataSource<T, U> = IOnchainEventIndexer<T, U>
type IDataSourceItem = DecodedLogWithContext

export abstract class DataProvider<T extends string, U> implements IDataProvider<T, U> {
  readonly #eventEmitter: EventEmitter = new EventEmitter()
  readonly #dataSource: IDataSource<T, U>

  protected abstract getKeyFromDataSourceItem(item: IDataSourceItem): T
  protected abstract formatDataSourceItem(key: T, unformattedItem: IDataSourceItem): Promise<U>

  constructor (dataSource: IDataSource<T, U>) {
    this.#dataSource = dataSource
  }

  /**
   * Initialization
   */

  async init (): Promise<void> {
    this.#startListeners()
    await this.#dataSource.init()
    console.log('Data provider initialized')
  }

  start (): void {
    this.#dataSource.start()
    console.log('Data provider started')
  }

  /**
   * Node events
   */

  #startListeners = (): void => {
    this.#dataSource.on(DATA_STORED_EVENT, this.#emitStoredData)
    this.#dataSource.on('error', () => { throw new Error('Data provider error') })
  }

  #emitStoredData = async (dataSourceItem: IDataSourceItem): Promise<void> => {
    const key: T = this.getKeyFromDataSourceItem(dataSourceItem)
    const formattedEventLog = await this.formatDataSourceItem(key, dataSourceItem)
    this.#eventEmitter.emit(key, formattedEventLog)
  }

  on (event: string, listener: (...args: any[]) => void): void {
    this.#eventEmitter.on(event, listener)
  }

  /**
   * Getters
   */

  // Note: the response is a different U than the previous U
  async fetchItem(key: T, value: U): Promise<U | null> {
    try {
      const item: IDataSourceItem = await this.#dataSource.retrieveItem(key, value)
      return this.formatDataSourceItem(key, item)
    } catch (err) {
      console.log(`Error fetching item with key ${key} from data source`)
      return null
    }
  }
}
