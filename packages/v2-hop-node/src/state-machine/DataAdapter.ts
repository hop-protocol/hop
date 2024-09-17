import { EventEmitter } from 'node:events'
import { getBlockTimestampFromLogMs } from '#utils/getBlockTimestampFromLogMs.js'
import { Logger } from '#logger/index.js'
import { DATA_PROCESSED_EVENT } from '#constants/index.js'
import type { IDataAdapter } from './IDataAdapter.js'
import type { IOnchainEventIndexer } from '#indexer/index.js'
import type { DecodedLogWithContext, IndexedEventDataWithContext } from '#types/index.js'
import type { StateTxContext } from './types.js'

// TODO: Optimize: Generalize for additional data sources beyond onchain events
type IDataSource<T> = IOnchainEventIndexer<T>

/**
 * This class is responsible for formatting data to and from the state machine.
 *
 * The state machine is unconcerned with logs, events, and indexes.
 *
 * The indexer is unconcerned with states.
 */

export abstract class DataAdapter<State, StateData extends StateTxContext, EventName> implements IDataAdapter<State, StateData> {
  readonly #eventEmitter: EventEmitter = new EventEmitter()
  readonly #dataSource: IDataSource<EventName>
  protected readonly logger: Logger

  protected abstract formatDecodedLog (log: DecodedLogWithContext): StateData
  protected abstract getStateFromEventName (eventName: string): State
  protected abstract getEventNameFromState (state: State): EventName
  protected abstract getEventChainIdForState (state: State, value: StateData): string
  // @dev this is not strictly typed since it should not be used by most clients. This
  // is custom for CCTP and there is no need to add complex typing or tight coupling to
  // accommodate this. All clients that don't modify event names should be unconcerned.
  protected parseStateMachineData (state: State, value: StateData): any {
    return value
  }

  constructor (name: string, dataSource: IDataSource<EventName>) {
    this.#dataSource = dataSource
    const tag = name + 'DataAdapter'
    this.logger = new Logger({
      tag,
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
    this.#dataSource.on(DATA_PROCESSED_EVENT, (inputData: DecodedLogWithContext) => {
      this.#handleDataProcessedEvent(inputData).catch(err => { process.exit(1) })
    })

    this.#dataSource.on('error', (err) => {
      console.error('Data adapter error', err)
      process.exit(1)
    })
  }

  #handleDataProcessedEvent = async (inputData: DecodedLogWithContext): Promise<void> => {
    try {
      const state = this.getStateFromEventName(inputData.context.eventName)
      const formattedInputData = await this.#toStateMachine(inputData)
      this.#eventEmitter.emit(DATA_PROCESSED_EVENT, state, formattedInputData)
    } catch (err) {
      this.logger.error('Error handling data processed event', err)
      throw new Error('Data adapter error')
    }
  }

  on (event: string, listener: (...args: any[]) => void): void {
    this.#eventEmitter.on(event, listener)
  }

  /**
   * Data propagation
   */

  async fetchItem(state: State, outputData: StateData): Promise<StateData | null> {
    const parsedOutputData = await this.#fromStateMachine(state, outputData)

    // The data source will take the parsed output data and use it as the keys to fetch the input data.
    // Typing this in a generic way is difficult since the keys are dynamic and depend on their respective
    // context-specific logic. Because of this, the data at this point in the process may be invalid, but
    // it is the responsibility of the data source to handle this. The data source will throw if the
    // data is invalid. It will return null if the incoming data is valid but does not exist.
    let inputData: DecodedLogWithContext | null
    try {
      inputData = await this.#dataSource.fetchItem(parsedOutputData)
    } catch (err) {
      throw new Error('Error fetching item, invalid data')
    }

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
    // TODO: Optimize: The return type of this should be StateData without context.
    // This would allow the concrete implementation to not worry about it.
    // As it stands, the concrete implementation either does incorrect
    // type assertions or has to implement this method.
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
  ): Promise<IndexedEventDataWithContext<EventName>> {
    const eventChainId = this.getEventChainIdForState(state, value)
    const eventName = this.getEventNameFromState(state)
    const modifiedValue = this.parseStateMachineData(state, value)
    return {
      eventChainId,
      eventName,
      eventIndexValues: modifiedValue
    }
  }
}
