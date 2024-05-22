import { AbstractRepository } from '../db/AbstractRepository'
import { StateMachineDB } from '../db/StateMachineDB'
import { poll } from '../utils'

/**
 * FSM that is strictly concerned with the creation, transition, and termination of states. This
 * class is not concerned with performing any actions on the states or any implementation details.
 * 
 * Data used is retrieved from an external data repository.
 * 
 * Upon startup, the FSM will sync back to the latest known state.
 * 
 * @dev The initial and terminal states are null
 */

export abstract class FSM<State extends string, StateData>{
  readonly #states: State[]
  readonly #stateDB: StateMachineDB<State, string, StateData>
  readonly #dataRepository: AbstractRepository<State, StateData>
  readonly #pollIntervalMs: number = 60_000
  isFSMInitialized: boolean = false

  protected abstract isTransitionReady(state: State, value: StateData): boolean

  constructor (
    states: State[],
    stateMachineName: string,
    dataRepository: AbstractRepository<State, StateData>
  ) {
    this.#states = states
    this.#stateDB = new StateMachineDB(stateMachineName)
    this.#dataRepository = dataRepository
  }

  async start(): Promise<void> {
    await this.#init()
    this.#startListeners()
    this.#startPollers()
    this.isFSMInitialized = true
  }

  /**
   * Public API
   */

  async *getItemsInState(state: State): AsyncIterable<[string, StateData]> {
    yield* this.#stateDB.getItemsInState(state)
  }

  /**
   * Internal Processing
   */

  async #init(): Promise<void> {
    // Handle unsynced item initialization
    const syncMarker = await this.#stateDB.getSyncMarker()
    for await (const [key, value, newSyncMarker] of this.#dataRepository.getSyncItems(syncMarker)) {
      await this.#initializeItem(key, value)
      // SyncMarker should be updated atomically, however, this requires deep drilling. This likely means
      // there is a better way. Instead, inefficiently update the sync marker after each item is processed.
      await this.#stateDB.updateSyncMarker(newSyncMarker)
    }

    // Handle pending state transitions
    for (const state of this.#states) {
      await this.#checkStateTransition(state)
    }
  }

  #startListeners (): void {
    this.#dataRepository.on(AbstractRepository.EVENT_ITEM_CREATED, (key: string, value: StateData) => this.#initializeItem(key, value))
    this.#dataRepository.on('error', () => { throw new Error('Data repository error') })
  }

  #startPollers (): void {
    for (const state of this.#states) {
      poll(() => this.#checkStateTransition(state), this.#pollIntervalMs)
    }
  }

  #checkStateTransition = async (state: State): Promise<void> => {
    for await (const [key, value] of this.#stateDB.getItemsInState(state)) {
      const canTransition = this.isTransitionReady(state, value)
      if (!canTransition) return

      await this.#transitionState(state, key, value)
    }
  }

  /**
   * State transitions
   */

  async #initializeItem(key: string, value: StateData): Promise<void> {
    const firstState = this.#getFirstState()
    return this.#stateDB.createItemIfNotExist(firstState, key, value)
  }

  async #transitionState(state: State, key: string, value: StateData): Promise<void> {
    const nextState = this.#getNextState(state)
    if (nextState === null) {
      // This is the final state state
      return this.#stateDB.updateState(state, nextState, key, value)
    }

    const stateTransitionData = await this.#dataRepository.getItem(nextState, value)
    if (!stateTransitionData) {
      return
    }
    const nextValue = { ...stateTransitionData, ...value }
    return this.#stateDB.updateState(state, nextState, key, nextValue)
  }

  /**
   * State utils
   */

  #getFirstState(): State {
    return this.#states[0]
  }

  #getNextState(state: State): State | null {
    const index = this.#states.indexOf(state)

    // If the state is unknown, the index will be -1
    if (index === -1) {
      throw new Error('Invalid state')
    }

    // If this is the last state, the next state is null
    if (index + 1 === this.#states.length) {
      return null
    }

    return this.#states[index + 1]
  }
}
