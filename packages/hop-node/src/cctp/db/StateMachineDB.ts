import { type ChainedBatch } from './DB'
import { SyncDB } from './SyncDB'

/**
 * Uses state-indexed subDBs with the state to allow for efficient querying.
 * - relayed!0x1234
 *
 * The final state writes to the top-level DB. It will exist in no other state subDB.
 * - 0x1234
 * 
 * An item only exists in one state subDB at a time.
 */

export class StateMachineDB<State extends string, StateData> extends SyncDB<State, StateData> {

  async createItemIfNotExist(initialState: State, key: string, value: StateData): Promise<void> {
    const existingValue = await this.get(this.encodeKey(key))
    if (!existingValue) {
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
    key: string,
    value: StateData
  ): Promise<void> {
    return this.#updateState(state, nextState, key, value)
  }

  async #updateState(
    state: State | null,
    nextState: State | null,
    key: string,
    value: StateData
  ): Promise<void> {
    // Falsy check is intentional to ensure that the state is not undefined
    if (state == null && nextState == null) {
      throw new Error('At least one state must be defined')
    }

    const existingValue: StateData | null = await this.getIfExists(this.encodeKey(key))
    const updatedValue = { ...existingValue, ...value }

    const batch: ChainedBatch<this, State, StateData> = this.batch()
    // Delete the current state entry if this is not the initial state
    if (state !== null) {
      batch.del(this.encodeKey(key), { sublevel: this.sublevel(state) })
    }

    // Add the next state entry
    const opts = nextState === null ? {}: { sublevel: this.sublevel(nextState) }
    batch.put(this.encodeKey(key), updatedValue, opts)

    return batch.write()
  }

  /**
   * Iterators
   */

  async *getItemsInState(state: State): AsyncIterable<[State, StateData]> {
    for await (const [key, value] of this.sublevel(state).iterator()) {
      yield [key as State, value as StateData]
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
