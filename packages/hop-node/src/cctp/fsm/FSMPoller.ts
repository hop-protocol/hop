import { StateMachineDB } from '../db/StateMachineDB'

/**
 * Expects the terminal state of stateTransitionMap to be null.
 */

export abstract class FSMPoller<T extends string, U>{
  readonly #pollIntervalMs: number = 60_000
  readonly #db: StateMachineDB<T, U>
  readonly #stateTransitionMap: Record<T, T | null>

  // Preconditions
  protected abstract isStateTransitionPreconditionMet(state: T, key: string, value: U): boolean
  protected abstract isStateActionPreconditionMet(state: T, key: string, value: U): boolean

  // Trigger event
  protected abstract getTransitionEvent(state: T, key: string): Promise<U | undefined>

  // Actions
  protected abstract performAction(state: T, value: U): Promise<void>

  // Hooks
  protected abstract handleStateExitHook(state: T, key: string, value: U): void

  constructor (stateMachineName: string, stateTransitionMap: Record<T, T | null>) {
    this.#db = new StateMachineDB(stateMachineName)
    this.#stateTransitionMap = stateTransitionMap

    this.#poll()
  }

  async #poll(): Promise<void> {
    setTimeout(this.#pollStateTransition, this.#pollIntervalMs)
    setTimeout(this.#pollStateAction, this.#pollIntervalMs)
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

  /**
   * Checkers
   */

  async #checkStateTransition(state: T, key: string, value: U): Promise<void> {
    const isPreconditionMet = this.isStateTransitionPreconditionMet(state, key, value)
    if (!isPreconditionMet) return

    const transitionData: U | undefined = await this.getTransitionEvent(state, key)
    if (!transitionData) return

    await this.transitionState(state, key, transitionData)
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

  async transitionState(currentState: T, key: string, transitionValue: U): Promise<void> {
    // The terminal state may be null, so we cast it to T and the DB will handle it
    const newState = this.#stateTransitionMap[currentState] as T
    return this.#db.updateState(currentState, newState, key, transitionValue)
  }

  async *#getItemsInState(state: T): AsyncIterable<[string, U]> {
    for await (const [key, value] of this.#db.getItemsInState(state)) {
      yield [key, value]
    }
  }
}
