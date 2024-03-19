import { Chain } from 'src/constants'
import { StateMachineDB } from '../db/StateMachineDB'
import { TransitionDataProvider } from '../cctp/transitionData/TransitionDataProvider'
import { wait } from 'src/utils/wait'

// TODO: Not this here
import { IMessage, MessageState } from '../cctp/MessageManager'

// TODO: Remove
const CREATION_CACHE: Set<string> = new Set()

/**
 * Expects the terminal state of stateTransitionMap to be null.
 */

export abstract class FSMPoller<T extends MessageState, U extends IMessage>{
  // TODO: Timing
  // TODO: SLow down
  readonly #pollIntervalMs: number = 10_000
  readonly #db: StateMachineDB<T, U>
  readonly #stateTransitionMap: Record<T, T | null>
  readonly #transitionDataProvider: TransitionDataProvider<T, U>

  // TODO: Many of these abstract methods shouldn't be concerned with the initial state -- figure that out
  // Preconditions
  protected abstract isStateTransitionPreconditionMet(state: T, key: string, value: U): boolean
  protected abstract isStateActionPreconditionMet(state: T, key: string, value: U): boolean

  // Trigger event
  protected abstract getStateCreationKey(value: U): string

  // Actions
  protected abstract performAction(state: T, value: U): Promise<void>

  // Hooks
  protected abstract handleStateExitHook(state: T, key: string, value: U): void

  constructor (stateMachineName: string, stateTransitionMap: Record<T, T | null>, chains: Chain[]) {
    this.#db = new StateMachineDB(stateMachineName)
    this.#stateTransitionMap = stateTransitionMap
    this.#transitionDataProvider = new TransitionDataProvider(chains)
  }

  start (): void {
    // TODO: not two diff pollers
    // TODO: Not per chain, just needed for secondary index though
    this.#initCreationPoller()

    for (const state of Object.keys(this.#stateTransitionMap)) {
      // TODO: Is running all states sequentially fine? Any issues with running them in parallel?
      // TODO: On startup, does one need to complete first?
      this.#initStatePoller(state as T)
    }
  }

  async #initCreationPoller(): Promise<void> {
    // TODO: more explicit err handling
    try {
      while (true) {
        await this.#pollCreation()

        await wait(this.#pollIntervalMs)
      }
    } catch (err) {
      console.error('poll err', err)
      process.exit(1)
    }
  }


  async #initStatePoller(state: T): Promise<void> {
    // TODO: more explicit err handling
    try {
      while (true) {
        // TODO: Don't block...but also be wary of promise.all
        await this.#pollStateTransition(state)
        await this.#pollStateAction(state)

        await wait(this.#pollIntervalMs)
      }
    } catch (err) {
      console.error('poll err', err)
      process.exit(1)
    }
  }

  #pollCreation = async (): Promise<void> => {
    for await (const value of this.#getCreationData()) {
      await this.#checkStateCreation(value)
    }
  }

  #pollStateTransition = async (state: T): Promise<void> => {
    for await (const [key, value] of this.#getItemsInState(state)) {
      await this.#checkStateTransition(state, key, value)
    }
  }

  #pollStateAction = async (state: T): Promise<void> => {
    for await (const [key, value] of this.#getItemsInState(state)) {
      await this.#checkStateAction(state, key, value)
    }
  }

  // TODO: Does this belong here or up a level?
  async getTransitionEvent (newState: T, messageNonce: string, value: U): Promise<U | undefined> {
    // TODO: Better error handling -- should handle elsewhere
    try {
      // TODO: Assert that newState cannot be the initial state
      const initialState = this.#getInitialState()
      if (newState === initialState) return
      return await this.#transitionDataProvider.getTransitionData(newState, value)
    } catch (err) {
      console.log('getTransitionEvent err', err)
      return
    }
  }

  /**
   * Checkers
   */

  async #checkStateCreation(value: U): Promise<void> {
    const key = this.getStateCreationKey(value)
    // TODO: RM
    if (CREATION_CACHE.has(key)) return

    await this.#createState(key, value)
  }

  async #checkStateTransition(state: T, key: string, value: U): Promise<void> {
    const isPreconditionMet = this.isStateTransitionPreconditionMet(state, key, value)
    if (!isPreconditionMet) return

    const newState = this.#stateTransitionMap[state] as T

    // TODO: Better terminal state handlling
    let transitionData: U
    if (newState === null) {
      transitionData = value
    } else {
      const transitionEventData: U | undefined = await this.getTransitionEvent(newState, key, value)
      if (!transitionEventData) return
      transitionData = transitionEventData
    }

    await this.transitionState(state, newState, key, transitionData)
    this.handleStateExitHook(state, key, transitionData)
  }

  async #checkStateAction(state: T, key: string, value: U): Promise<void> {
    const isPreconditionMet = this.isStateActionPreconditionMet(state, key, value)
    if (!isPreconditionMet) return

    await this.performAction(state, value)
  }

  /**
   * DB interactions
   */

  async #createState(key: string, value: U): Promise<void> {
    const initialState = this.#getInitialState()
    await this.#db.createItem(initialState, key, value)
    // TODO: RM cache
    CREATION_CACHE.add(key)
    return
  }

  async transitionState(currentState: T, newState: T, key: string, value: U): Promise<void> {
    // The terminal state may be null, so we cast it to T and the DB will handle it
    return this.#db.updateState(currentState, newState, key, value)
  }

  async *#getCreationData(): AsyncIterable<U> {
    for await (const value of this.#transitionDataProvider.getCreationData()) {
      yield value
    }
  }

  async *#getItemsInState(state: T): AsyncIterable<[string, U]> {
    for await (const [key, value] of this.#db.getItemsInState(state)) {
      yield [key, value]
    }
  }

  #getInitialState(): T {
    return Object.keys(this.#stateTransitionMap)[0] as T
  }
}
