import { EventEmitter } from 'node:events'
import { IDataProvider } from './IDataProvider.js'
import { Logger } from '#logger/index.js'
// TODO: V2: Imports below here should be abstracted away into a generalized
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

// TODO: V2: Abstract away these types into a generalized data-source module
// when there are multiple implementations.
type IDataSource<T, U> = IOnchainEventIndexer<T, U>
type IDataSourceItem = DecodedLogWithContext

export abstract class DataProvider<T extends string, U> implements IDataProvider<T, U> {
  readonly #eventEmitter: EventEmitter = new EventEmitter()
  readonly #dataSource: IDataSource<T, U>
  protected readonly logger: Logger

  protected abstract getKeyFromDataSourceItem(item: IDataSourceItem): T
  protected abstract formatDataSourceItem(key: T, unformattedItem: IDataSourceItem): Promise<U>

  constructor (dataSource: IDataSource<T, U>) {
    this.#dataSource = dataSource
    this.logger = new Logger({
      tag: 'DataProvider',
      color: 'yellow'
    })
  }

  /**
   * Initialization
   */

  async init (): Promise<void> {
    this.#initListeners()
    await this.#dataSource.init()
    this.logger.info('Data provider initialized')
  }

  start (): void {
    this.#dataSource.start()
    this.logger.info('Data provider started')
  }

  /**
   * Node events
   */

  #initListeners = (): void => {
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
      return await this.formatDataSourceItem(key, item)
    } catch (err) {
      this.logger.warn(`Error fetching item with key ${JSON.stringify(key)} from data source, value: ${JSON.stringify(value)}`)
      return null
    }
  }
}
