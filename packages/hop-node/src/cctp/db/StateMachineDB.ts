import { DB } from './DB.js'
import { normalizeDBValue } from './utils.js'

/**
 * Uses state-indexed subDBs with the state to allow for efficient querying.
 * - Ex: relayed!0x1234
 *
 * The value of the item in each state contains the data for that state and all previous states.
 * 
 * The final state writes to the top-level DB. It will exist in no other state subDB.
 * - Ex: 0x1234
 * 
 * An item only exists in one state subDB at a time.
 */

export class StateMachineDB<State extends string, Key extends string, StateData> extends DB<Key, StateData> {

  constructor (dbName: string) {
    super(dbName + 'StateMachineDB')
  }

  async createItemIfNotExist(initialState: State, key: Key, value: StateData): Promise<void> {
    let existingValue: StateData
    try {
      existingValue = await this.get(key)
    } catch (err) {
      return this.#updateState(null, initialState, key, value)
    }

    const doesMatch = this.#compareItems(value, existingValue)
    if (!doesMatch) {
      throw new Error('Item already exists with different values')
    }
  }

  async updateState(
    state: State,
    nextState: State | null,
    key: Key,
    value: StateData
  ): Promise<void> {
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

    const existingValue: StateData | null = await this.getIfExists(key)
    const updatedValue = { ...existingValue, ...value }

    const batch = this.batch()
    // Delete the current state entry if this is not the initial state
    if (state !== null) {
      batch.del(key, { sublevel: this.getSublevel(state) })
    }

    // Add the next state entry
    const opts = nextState === null ? {} : { sublevel: this.getSublevel(nextState) }
    batch.put(key, updatedValue, opts)

    return batch.write()
  }

  /**
   * Iterators
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

  #compareItems = (value: StateData, dbValue: StateData): boolean => {
    // The dbValue may have more keys than the value being compared
    for (const key in value) {
      if (value[key] !== dbValue?.[key]) {
        return false
      }
    }
    return true
  }
}
