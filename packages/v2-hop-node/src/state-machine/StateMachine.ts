import type { IDataAdapter } from './IDataAdapter.js'
import { StateMachineDB } from './StateMachineDB.js'
import { poll } from '#utils/poll.js'
import { getFirstState, isLastState } from './utils.js'
import type { IStateMachine } from './IStateMachine.js'
import { Logger } from '#logger/index.js'
import { DATA_PROCESSED_EVENT, TimeIntervals } from '#constants/index.js'
import type { IRelayer } from '#relayer/IRelayer.js'
import type { NextState, StateTxContext } from './types.js'

/**
 * State machine that is strictly concerned with the creation, transition, and termination of states. This
 * class is not concerned with performing any actions on the states or any implementation details.
 *
 * Data used is retrieved from an external data stores.
 *
 * An item will not be polled for a state transition until the implemented shouldAttemptTransition time has
 * passed. This represents the minimum amount of time expected for the expected transaction to have been
 * sent and finalized.
 *
 * The initial state is marked as uninitialized in the DB until the time has passed for the transaction to
 * be sent and finalized. Once the time has passed, the item is initialized and the state machine will
 * attempt to transition the state.
 *
 * @dev The final state is not polled since there is no transition after it.
 */

// The relayer is unconcerned with the context of transactions, so
// that is removed from the data that is relayed.
type RelayItem<StateData extends object = object> = Omit<StateData, 'txContext'>

export abstract class StateMachine<State extends string, StateData extends StateTxContext> implements IStateMachine {
  readonly #states: State[]
  readonly #db: StateMachineDB<State, NextState<State>, string, StateData>
  readonly #dataAdapter: IDataAdapter<State, StateData>
  readonly #relayer: IRelayer
  // This poller is what triggers the state transitions. The main resource consumed per poll is DB writes,
  // which is not a heavy load. The rest of the system should be set up such that these polls should not
  // consume many more resources than that due to the check in shouldAttemptTransition. If this poller
  // is too slow, users will have to wait longer for state transitions to the point where they
  // will be have to wait a relatively long time for the relay of their message.
  readonly #pollIntervalMs: number = 10_000
  // The maximum amount of time an item can be in the DB before it is considered stale and missed.
  // The resource consumed by this is a DB read per poll plus any fetches to validate state, which
  // adds up with many misses. This is meant to avoid a huge number of missed events in the DB.
  readonly #maxItemAgeMs: number = TimeIntervals.ONE_DAY_MS
  protected readonly logger: Logger

  protected abstract getStates(): State[]
  protected abstract getItemId(value: StateData): string
  // Checks if the implementation believes that the data source should have the state transition
  // NOTE: The final state does not need to be handled since there are no more transitions after it
  protected abstract shouldAttemptTransition(state: State, value: StateData): boolean
  protected abstract getTransitionState(state: State): State
  protected abstract getRelayChainId(state: State, value: StateData): string

  constructor (
    name: string,
    dataAdapter: IDataAdapter<State, StateData>,
    relayer: IRelayer<RelayItem>
  ) {
    this.#db = new StateMachineDB(name)
    this.#dataAdapter = dataAdapter
    this.#relayer = relayer
    this.#states = this.getStates()
    const tag = name + 'StateMachine'
    this.logger = new Logger({
      tag,
      color: 'green'
    })
  }

  /**
   * Initialization
   */

  async init (): Promise<void> {
    this.#initListeners()
    await this.#dataAdapter.init()

    // This handles any pending state transitions upon startup
    // Do not process in parallel, since this intentionally
    // processes each state in order.
    for (const state of this.#states) {
      await this.#checkStateTransition(state)
    }
    this.logger.info('State machine initialized')
  }

  start (): void {
    this.#startPollers()
    this.#relayer.start()
    this.#dataAdapter.start()
    this.logger.info('State machine started')
  }

  /**
   * Node events
   */

  #initListeners (): void {
    this.#dataAdapter.on(DATA_PROCESSED_EVENT, (state: State, value: StateData) => {
      this.#handleDataProcessedEvent(state, value).catch(err => { process.exit(1) })
    })
    this.#dataAdapter.on('error', () => { throw new Error('State machine error') })
  }

  #handleDataProcessedEvent = async (state: State, value: StateData): Promise<void> => {
    try {
      await this.#addNewItem(state, value)
    } catch (err) {
      this.logger.error('Error handling data processed event', err)
      throw new Error('State machine error')
    }
  }

  /**
   * Getters
   */

  protected async *getItemsInState(state: State): AsyncIterable<[string, StateData]> {
    yield* this.#db.getItemsInState(state)
  }

  /**
   * Poller
   */

  #startPollers (): void {
    for (const state of this.#states) {
      void poll(() => this.#checkStateTransition(state), this.#pollIntervalMs, this.logger)
    }
  }

  #checkStateTransition = async (state: State): Promise<void> => {
    // There is no transition for the final state
    if (isLastState(this.#states, state)) return

    for await (const [key, value] of this.#db.getItemsInState(state)) {
      const shouldProceed = await this.#preTransitionHook(state, value, key)
      if (!shouldProceed) continue

      const shouldAttempt = this.shouldAttemptTransition(state, value)
      if (!shouldAttempt) continue

      // Uninitialized items need to be initialized before they can be transitioned
      const didInitialize = await this.#handleInitialization(state, key, value)
      if (didInitialize) continue

      // TODO: Optimize: Enforce the NextState<State> type in the implementation
      const nextState = this.getTransitionState(state) as NextState<State>
      if (state === nextState) continue

      const nextValue = await this.#dataAdapter.fetchItem(nextState, value)
      if (!nextValue) continue

      await this.#transitionState(state, nextState, nextValue, key)
      // Intentionally not awaiting to avoid blocking the poller, since the relayer
      // is independent of the state machine
      void this.#postTransitionHook(state, key, value)
    }
  }

  /**
   * State transitions
   */

  #addNewItem = async (state: State, value: StateData): Promise<void> => {
    if (state !== getFirstState(this.#states)) return

    const key = this.getItemId(value)
    this.logger.info(`Adding item with key: ${key}, value: ${JSON.stringify(value)}`)
    await this.#db.addUninitializedItem(state, key, value)
  }

  #handleInitialization = async (state: State, key: string, value: StateData): Promise<boolean> => {
    if (state !== getFirstState(this.#states)) return false
    if (await this.#db.isItemInitialized(key)) return false

    void this.#sendRelay(state, key, value)
    await this.#db.initializeItem(key)
    return true
  }

  async #transitionState(
    state: State,
    nextState: NextState<State>,
    nextValue: StateData,
    key: string
  ): Promise<void> {
    this.logger.info(`Transitioning item with key: ${key} from state: ${state} to state: ${JSON.stringify(nextState)}`)
    const isLastTransition = isLastState(this.#states, nextState)
    if (isLastTransition) {
      await this.#db.updateFinalState(state, key, nextValue)
    }
    await this.#db.updateState(state, nextState, key, nextValue)
  }

  /**
   * Hooks
   */

  async #preTransitionHook (state: State, value: StateData, key: string): Promise<boolean> {
    const eventTimestampMs = value.txContext.timestampMs
    if (eventTimestampMs < Date.now() - this.#maxItemAgeMs) {
      this.logger.error(`Missed event for state: ${state}, key: ${key}`)
      await this.#db.discardItem(this.#states, value, key)
      return false
    }
    return true
  }

  async #postTransitionHook (state: State, key: string, value: StateData): Promise<boolean> {
    this.logger.debug(`Post transition hook for state: ${state}, key: ${key}`)
    await this.#sendRelay(state, key, value)
    return true
  }

  /**
   * Utils
   */

  async #sendRelay(state: State, key: string, value: StateData): Promise<void> {
    this.logger.debug(`Relaying item for state: ${state}, key: ${key}`)
    // The first state hook will have nothing in the DB to read
    let relayItem: RelayItem<StateData> | undefined
    if (state === getFirstState(this.#states)) {
      relayItem = value
    } else {
      relayItem = await this.#getRelayItem(key)
    }

    // TODO: In theory, the state machine should not care about the chain.
    const relayChainId: string = this.getRelayChainId(state, value)
    return this.#relayer.relay({
      ...relayItem,
      relayChainId
    })
  }

  // Aggregate all existing data to send to the relayer. The relayer
  // doesn't care about the state, only the data it needs to relay.
  async #getRelayItem(key: string): Promise<RelayItem<StateData>> {
    const stateAndItem: [State, StateData][] = await this.#db.getItemByKey(key, this.#states)

    return stateAndItem.reduce((acc, [, data]) => {
      const { txContext, ...restData } = data
      return { ...acc, ...restData }
    }, {} as RelayItem<StateData>)
  }
}
