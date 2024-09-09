import type { IDataAdapter } from './IDataAdapter.js'
import { StateMachineDB } from '#db/StateMachineDB.js'
import { poll } from '#utils/poll.js'
import { getFirstState, getNextState, isLastState } from './utils.js'
import type { IStateMachine } from './IStateMachine.js'
import { Logger } from '#logger/index.js'
import { DATA_PROCESSED_EVENT } from '#constants/index.js'
import type { IRelayer } from '#relayer/IRelayer.js'
import type { NextState, StateTxContext } from './types.js'

/**
 * State machine that is strictly concerned with the creation, transition, and termination of states. This
 * class is not concerned with performing any actions on the states or any implementation details.
 *
 * Data used is retrieved from an external data stores.
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
  protected readonly logger: Logger

  protected abstract getStates(): State[]
  protected abstract getItemId(value: StateData): string
  // Checks if the implementation believes that the data source should have the state transition
  // NOTE: The final state does not need to be handled since there are no more transitions after it
  protected abstract shouldAttemptTransition(state: State, value: StateData): boolean

  constructor (
    dbName: string,
    dataAdapter: IDataAdapter<State, StateData>,
    relayer: IRelayer<RelayItem>
  ) {
    this.#db = new StateMachineDB(dbName)
    this.#dataAdapter = dataAdapter
    this.#relayer = relayer
    this.#states = this.getStates()
    this.logger = new Logger({
      tag: 'StateMachine',
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
    // NOTE: Do not process in parallel, since this intentionally
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
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.#dataAdapter.on(DATA_PROCESSED_EVENT, this.#initializeItem)
    this.#dataAdapter.on('error', () => { throw new Error('State machine error') })
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
      const shouldAttempt = this.shouldAttemptTransition(state, value)
      if (shouldAttempt) continue


      const nextState = getNextState(this.#states, state)
      const nextValue = await this.#dataAdapter.fetchItem(nextState, value)
      if (!nextValue) continue

      await this.#transitionState(state, nextState, nextValue, key)
      // Intentionally not awaiting to avoid blocking the poller, since the relayer
      // is independent of the state machine
      void this.#postTransitionHook(state, key)
    }
  }

  /**
   * State transitions
   */

  // Only used for initialization of items into the first state
  #initializeItem = async (state: State, value: StateData): Promise<void> => {
    const firstState = getFirstState(this.#states)
    if (state !== firstState) return

    const key = this.getItemId(value)
    this.logger.info(`Initializing item with key: ${key}, value: ${JSON.stringify(value)}`)
    return this.#db.createItemIfNotExist(firstState, key, value)
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

  async #postTransitionHook (state: State, key: string): Promise<void> {
    const nextState = getNextState(this.#states, state)

    // There is no action needed for the final state
    const isLastStateHook = isLastState(this.#states, nextState)
    if (isLastStateHook) {
      return
    }

    const relayItem = await this.#getRelayItem(key)
    return this.#relayer.relay(relayItem)
  }

  // Aggregate all existing data to send to the relayer. The relayer
  // doesn't care about the state, only the data it needs to relay.
  async #getRelayItem(key: string): Promise<RelayItem<StateData>> {
    const stateAndItem: [State, StateData][] = await this.#db.getItemByKey(key, this.#states)

    return stateAndItem.reduce((acc, [, data]) => {
      const { txContext, ...restData } = data
      return { ...acc, ...restData, }
    }, {} as RelayItem<StateData>)
  }
}
