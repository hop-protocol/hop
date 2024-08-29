import { DB } from './DB.js'
import { normalizeDBValue } from './utils.js'

/**
 * Each item is indexable by its primary key. All of an items state information is stored in this DB.
 * Each item has a secondary index of a state name for retrieval of state-specific information
 * for that item.
 *
 * Each state is indexable by the state name. This allows for efficient querying of all items in a state.
 * Each state has a secondary index of the primary key of the item. This allows for efficient querying of
 * the item in that state without needing an additional call to the top-level DB.
 *
 * There many not be any duplicate secondary keys for a state name primary key at any given time. This
 * is because the item can only exist in a single state at a time.
 *
 * After transitioning to the final state, the item will not be queryable as a secondary index to a 
 * state name primary index. It will continue to exist as a primary key.
 *
 * Key format:
 * - key!state
 * - state!key
 */

export class StateMachineDB<State extends string, Key extends string, StateData> extends DB<Key, StateData> {

  constructor (dbName: string) {
    super(dbName + 'StateMachineDB')
  }

  async createItemIfNotExist(initialState: State, key: Key, value: StateData): Promise<void> {
    if (await this.has(key)) {
      return this.#handlePossibleReorg(key, value)
    }
    return this.#updateState(null, initialState, key, value)
  }

  async updateFinalState(state: State, key: Key, value: StateData): Promise<void> {
    return this.#updateState(state, null, key, value)
  }

  async updateState(state: State, nextState: State, key: Key, value: StateData): Promise<void> {
    return this.#updateState(state, nextState, key, value)
  }

  async #updateState(
    state: State | null,
    nextState: State | null,
    key: Key,
    value: StateData
  ): Promise<void> {
    // Falsy check is intentional to ensure that the state is not undefined
    if (state == null && nextState == null) {
      throw new Error('At least one state must be defined')
    }

    const batch = this.batch()

    // Delete the current state entry if this is not the initial state
    if (state !== null) {
      batch.del(key, { sublevel: this.getSublevel(state) })
    }

    // Write the next state entry if this is not the final state
    if (nextState !== null) {
      batch.put(key, value, { sublevel: this.getSublevel(nextState) })
    }

    // Write the key as the primary key using the state as the secondary key
    batch.put(nextState ?? state, value, { sublevel: this.getSublevel(key) })

    this.logger.debug(`Updating state for key: ${key} from ${state} to ${nextState}, value: ${JSON.stringify(value)}`)
    return batch.write()
  }

  /**
   * Getters
   */

  async *getItemsInState(state: State): AsyncIterable<[Key , StateData]> {
    for await (const [key, value] of this.getSublevel(state).iterator()) {
      const filteredValue = normalizeDBValue(value)
      yield [key as Key, filteredValue as StateData]
    }
  }

  /**
   * Utils
   */

  // TODO: V2: A reorg that changes the state of an item is not currently handled. The current
  // implementation removes both such that the message will never be handled. This should
  // be handled more gracefully.
  #handlePossibleReorg = async (key: Key, value: StateData): Promise<void> => {
    const existingValue = await this.get(key)
    const doesMatch = this.#compareItems(value, existingValue)
    this.logger.warn(`Reorg observed. Deleting all states for key: ${key}. ${doesMatch ? 'The items matched.' : 'The items did not match.'}`)
    await this.del(key)
  }

  #compareItems = (value: StateData, dbValue: StateData): boolean => {
    // The dbValue may have more keys than the value being compared
    for (const key in value) {
      if (value[key] !== dbValue[key]) {
        return false
      }
    }
    return true
  }
}
