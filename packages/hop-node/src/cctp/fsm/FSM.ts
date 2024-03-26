import { AbstractRepository } from '../repository/AbstractRepository'
import { StateMachineDB } from '../db/StateMachineDB'
import { poll } from '../utils'

/**
 * FSM that is strictly concerned with the creation, transition, and termination of states. This
 * class is not concerned with performing any actions on the states or any implementation details.
 * 
 * Data used is retrieved from an external data repository.
 * 
 * @dev The initial and terminal states are null
 */

export abstract class FSM<T, U>{
  readonly #states: T[]
  readonly #stateDb: StateMachineDB<T, U>
  readonly #dataRepository: AbstractRepository<T, U>
  readonly #pollIntervalMs: number = 60_000

  protected abstract isTransitionReady(state: T, value: U): boolean

  constructor (
    states: T[],
    stateMachineName: string,
    dataRepository: AbstractRepository<T, U>
  ) {
    this.#states = states
    this.#stateDb = new StateMachineDB(stateMachineName)
    this.#dataRepository = dataRepository 
  }

  async start(): Promise<void> {
    await this.#init()
    this.#startListeners()
    this.#startPollers()
  }

  async #init(): Promise<void> {
    // Handle unsynced item initialization
    const syncMarker = await this.#stateDb.getSyncMarker()
    for await (const [key, value] of this.#dataRepository.getSyncItems(syncMarker)) {
      await this.#handleInitializeItem(key, value)
    }

    // Handle pending state transitions
    for (const state of this.#states) {
      await this.#checkStateTransition(state)
    }
  }

  #startListeners (): void {
    this.#dataRepository.on(AbstractRepository.EVENT_ITEM_CREATED, (key: string, value: U) => this.#handleInitializeItem(key, value))
    this.#dataRepository.on('error', () => { throw new Error('Data repository error') })
  }

  #startPollers (): void {
    for (const state of this.#states) {
      poll(() => this.#checkStateTransition(state), this.#pollIntervalMs)
    }
  }

  async #handleInitializeItem(key: string, value: U): Promise<void> {
    const didInitialize = await this.#initializeItem(key, value)
    if (didInitialize) {
      await this.#stateDb.updateSyncMarker(key)
    }
  }

  #checkStateTransition = async (state: T): Promise<void> => {
    for await (const [key, value] of this.#stateDb.getItemsInState(state)) {
      const canTransition = this.isTransitionReady(state, value)
      if (!canTransition) return

      await this.#transitionState(state, key, value)
    }
  }

  /**
   * State transitions
   */

  async #initializeItem(key: string, value: U): Promise<boolean> {
    const firstState = this.#getFirstState()
    const didCreateItem = await this.#stateDb.createItemIfNotExist(firstState, key, value)
    return didCreateItem
  }

  async #transitionState(state: T, key: string, value: U): Promise<void> {
    const isLastState = this.#getLastState() === state
    if (isLastState) {
      return this.#terminateState(key, value)
    }

    // The terminal state is handled above so we can safely cast
    const nextState = this.#getNextState(state as T) as T
    const stateTransitionData = await this.#dataRepository.getItem(nextState, value)
    if (!stateTransitionData) {
      return
    }
    const nextValue = Object.assign(stateTransitionData, value)
    return this.#stateDb.updateState(state, nextState, key, nextValue)
  }

  async #terminateState(key: string, value: U): Promise<void> {
    const lastState = this.#getLastState()
    return this.#stateDb.terminateItem(lastState, key, value)
  }

  /**
   * State utils
   */

  #getFirstState(): T {
    return this.#states[0]
  }

  #getLastState(): T {
    return this.#states[this.#states.length - 1]
  }

  #getNextState(state: T): T | null {
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
