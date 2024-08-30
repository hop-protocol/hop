import { EventEmitter } from 'node:events'
import { getBlockTimestampFromLogMs } from '#utils/getBlockTimestampFromLogMs.js'
import { Logger } from '#logger/index.js'
import { DATA_PROCESSED_EVENT } from '#constants/index.js'
import { filterObjectProperties } from '#utils/filterObjectProperties.js'
import type { IDataAdapter } from './IDataAdapter.js'
import type { IOnchainEventIndexer } from '#indexer/IOnchainEventIndexer.js'
import type { DecodedLogWithContext, IndexedEventDataWithContext } from '#types/index.js'
import type { StateTxContext } from './types.js'

// TODO: Generalize for additional data sources beyond onchain events
type IDataSource = IOnchainEventIndexer

/**
 * This class is responsible for formatting data to and from the state machine.
 *
 * The state machine is unconcerned with logs, events, and indexes.
 *
 * The indexer is unconcerned with states.
 */

export abstract class DataAdapter<
  State,
  StateData extends StateTxContext,
  EventIndexKey extends string,
  EventIndexValue extends object
> implements IDataAdapter<
  State,
  StateData
> {
  readonly #eventEmitter: EventEmitter = new EventEmitter()
  readonly #dataSource: IDataSource
  protected readonly logger: Logger

  protected abstract formatDecodedLog (log: DecodedLogWithContext): StateData
  protected abstract getStateFromEventName (eventName: string): State
  protected abstract getEventNameFromState (state: State): string
  protected abstract getIndexKeysByEventName (eventName: string): EventIndexKey[]

  constructor (dataSource: IDataSource) {
    this.#dataSource = dataSource
    this.logger = new Logger({
      tag: 'DataAdapter',
      color: 'yellow'
    })
  }

  /**
   * Initialization
   */

  async init (): Promise<void> {
    this.#initListeners()
    await this.#dataSource.init()
    this.logger.info('Data adapter initialized')
  }

  start (): void {
    this.#dataSource.start()
    this.logger.info('Data adapter started')
  }

  /**
   * Node events
   */

  #initListeners = (): void => {
    this.#dataSource.on(DATA_PROCESSED_EVENT, this.#emitStoredData)
    this.#dataSource.on('error', () => { throw new Error('Data adapter error') })
  }

  #emitStoredData = async (inputData: DecodedLogWithContext): Promise<void> => {
    const state = this.getStateFromEventName(inputData.context.eventName)
    const formattedInputData = this.#toStateMachine(inputData)
    this.#eventEmitter.emit(DATA_PROCESSED_EVENT, state, formattedInputData)
  }

  on (event: string, listener: (...args: any[]) => void): void {
    this.#eventEmitter.on(event, listener)
  }

  /**
   * Data propagation
   */

  async fetchItem(state: State, outputData: StateData): Promise<StateData | null> {
    const parsedOutputData = await this.#fromStateMachine(state, outputData)
    const inputData: DecodedLogWithContext | null = await this.#dataSource.fetchItem(parsedOutputData)
    if (!inputData) {
      return null
    }
    return this.#toStateMachine(inputData)
  }

  /**
   * Data manipulation
   */

  async #toStateMachine (log: DecodedLogWithContext): Promise<StateData> {
    const { transactionHash, context } = log
    const timestampMs = await getBlockTimestampFromLogMs(log)
    const formattedLog = this.formatDecodedLog(log)

    return {
      ...formattedLog,
      txContext: {
        txHash: transactionHash,
        timestampMs,
        chainId: context.chainId
      }
    }
  }

  async #fromStateMachine (
    state: State,
    value: StateData
  ): Promise<IndexedEventDataWithContext<EventIndexKey, EventIndexValue>> {
    const eventName = this.getEventNameFromState(state)
    const eventIndexKeys = this.getIndexKeysByEventName(eventName)
    const eventIndexValues = filterObjectProperties(value, eventIndexKeys) as EventIndexValue

    return {
      chainId: value.txContext.chainId,
      eventName,
      eventIndexKeys,
      eventIndexValues
    }
  }
}
