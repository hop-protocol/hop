import { DB } from './DB'

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
    
    // TODO: Add ChainedBatch
    const batch = this.batch().put(this.encodeKey(key), updatedValue)

    // Only delete if this is the initial state
    if (oldState !== newState) {
      batch.del(this.encodeKey(oldStateKey))
    }

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
