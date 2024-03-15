import { DB, DBKeyEncodingOptions } from './DB.js'

/**
 * DB Prefixes keys with the state to allow for efficient querying.
 * 
 * A prefixed key can only exist in one state at a time.
 * 
 * Once an object is in a terminal state, the prefixed entry is removed
 * but the object itself is not deleted and can be queried by its key.
 */

export class StateMachineDB extends DB {

  async updateState<T, U>(oldState: T, newState: T, key: string, value: U): Promise<void> {
    const oldStateKey = `${oldState}!${key}`
    const newStateKey = `${newState}!${key}`

    const existingValue = this.get<string, U>(key, DBKeyEncodingOptions)
    const updatedValue = Object.assign(existingValue, value)
    
    // TODO: Add ChainedBatch
    const batch = this.batch().put(key, updatedValue, DBKeyEncodingOptions)

    // Only delete if this is the initial state
    if (oldState !== newState) {
      batch.del(oldStateKey, DBKeyEncodingOptions)
    }

    // Only write if the new state is not the terminal state
    if (newState) {
      batch.put(newStateKey, updatedValue, DBKeyEncodingOptions)
    }

    return batch.write()
  }

  async *getItemsInState<T, U>(state: T): AsyncIterable<[string, U]> {
    // TODO: Possibly filter? Maybe not...
    const filter = {
      ...DBKeyEncodingOptions,
      gte: `${state}!`,
      lt: `${state}!~`
    }
    yield* this.iterator(filter)
  }
}
