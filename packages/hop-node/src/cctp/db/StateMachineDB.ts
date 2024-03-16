import { ChainedBatch, DB } from './DB'

type DBValue<T> = T

/**
 * DB Prefixes keys with the state to allow for efficient querying.
 * 
 * A prefixed key can only exist in one state at a time.
 * 
 * Once an object is in a terminal state, the prefixed entry is removed
 * but the object itself is not deleted and can be queried by its key.
 */

export class StateMachineDB<T extends string, U> extends DB<T, U> {

  async updateState(oldState: T, newState: T, key: string, value: U): Promise<void> {
    const oldStateKey = `${oldState}!${key}`
    const newStateKey = `${newState}!${key}`

    const existingValue = this.get(this.encodeKey(key))
    const updatedValue = Object.assign(existingValue, value)
    
    const batch: ChainedBatch<this, string, DBValue<U>>  = this.batch()
    
    // Always update the value to the top level key
    batch.put(this.encodeKey(key), updatedValue)

    // Always Only delete state-specific key if this is the initial state
    // If this is the initial state, the old state will not exist and this will not be executed
    batch.del(this.encodeKey(oldStateKey))

    // Only write if the new state is not the terminal state
    if (newState) {
      batch.put(this.encodeKey(newStateKey), updatedValue)
    }

    return batch.write()
  }

  async *getItemsInState(state: T): AsyncIterable<[string, U]> {
    // TODO: Possibly filter? Maybe not...
    const filter = {
      gte: `${state}!`,
      lt: `${state}!~`
    }
    yield* this.iterator(filter)
  }
}
