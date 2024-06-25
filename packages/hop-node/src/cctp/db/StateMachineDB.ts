import { DB } from './DB.js'
import { normalizeDBValue } from './utils.js'
import { Mutex } from 'async-mutex'

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
  #updateMutex: Mutex = new Mutex()

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
  /**
   * TODO: V2: Optimize this on a per-key basis instead of locking for every write.
   * 
   * Note: This might be built-in to LevelDB. Investigate.
   * 
   * In the worst case, consider a package like https://github.com/rogierschouten/async-lock
   * 
   * There is no way to natively update with LevelDB so we use a mutex to ensure that writes that occur at the same time
   * do not overwrite each other by reading stale data.
   */
    await this.#updateMutex.runExclusive(async () => {
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

      // Always write the aggregate
      let aggregateValue = value
      if (state !== null) {
        const existingValue: StateData = await this.get(key)
        aggregateValue = { ...existingValue, ...value }
      }
      batch.put(key, aggregateValue)

      this.logger.debug(`Updating state for key: ${key} from ${state} to ${nextState}, value: ${JSON.stringify(value)}`)
      return batch.write()
    })
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
      if (value[key] !== dbValue?.[key]) {
        return false
      }
    }
    return true
  }
}
