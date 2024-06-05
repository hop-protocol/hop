import { IDataStore } from '../data-store/IDataStore.js'
import { StateMachineDB } from '../db/StateMachineDB.js'
import { poll } from '../utils.js'
import { getFirstState, getNextState } from './utils.js'
import { IStateMachine } from './IStateMachine.js'

/**
 * State machine that is strictly concerned with the creation, transition, and termination of states. This
 * class is not concerned with performing any actions on the states or any implementation details.
 * 
 * Data used is retrieved from an external data stores.
 * 
 * Upon startup, the state machine will sync back to the latest known state.
 * 
 * @dev The initial and terminal states are null
 */

export abstract class StateMachine<State extends string, StateData> implements IStateMachine {
  readonly #states: State[]
  readonly #db: StateMachineDB<State, string, StateData>
  readonly #dataStore: IDataStore<State, StateData>
  readonly #pollIntervalMs: number = 10_000

  protected abstract getItemId(value: StateData): string
  protected abstract isTransitionReady(state: State, value: StateData): boolean

  constructor (
    dbName: string,
    states: State[],
    dataStore: IDataStore<State, StateData>
  ) {
    this.#db = new StateMachineDB(dbName)
    this.#states = states
    this.#dataStore = dataStore
  }

  /**
   * Initialization
   */

  async init (): Promise<void> {
    // Handle pending state transitions
    for (const state of this.#states) {
      await this.#checkStateTransition(state)
    }
    await this.#dataStore.init()
    console.log('State machine initialized')
  }
    
  start (): void {
    this.#startListeners()
    this.#startPollers()
    this.#dataStore.start()
    console.log('State machine started')
  }

  /**
   * Node events
   */

  #startListeners (): void {
    const initialState = getFirstState(this.#states)
    this.#dataStore.on(initialState, this.#initializeItem)
    this.#dataStore.on('error', () => { throw new Error('State machine error') })
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
      poll(() => this.#checkStateTransition(state), this.#pollIntervalMs)
    }
  }

  #checkStateTransition = async (state: State): Promise<void> => {
    for await (const [key, value] of this.#db.getItemsInState(state)) {
      const canTransition = this.isTransitionReady(state, value)
      if (!canTransition) return

      await this.#transitionState(state, key, value)
    }
  }

  /**
   * State transitions
   */

  async #initializeItem (value: StateData): Promise<void> {
    const firstState = getFirstState(this.#states)
    const key = this.getItemId(value)
    return this.#db.createItemIfNotExist(firstState, key, value)
  }

  async #transitionState(state: State, key: string, value: StateData): Promise<void> {
    const nextState = getNextState(this.#states, state)
    if (nextState === null) {
      // This is the final state state
      return this.#db.updateState(state, nextState, key, value)
    }

    const stateTransitionData = await this.#dataStore.fetchItem(nextState, value)
    if (!stateTransitionData) {
      return
    }
    const nextValue = { ...stateTransitionData, ...value }
    return this.#db.updateState(state, nextState, key, nextValue)
  }
}
