import { ChainedBatch, DB, KEY_ENCODING_OPTIONS } from './DB'

type DBValue<T> = T

/**
 * Uses state-keyed subDBs with the state to allow for efficient querying.
 * Example of an entry in the DB:
 * 0x123 -> DBValue
 * relayed!0x123 -> DBValue
 * 
 * An ID can only exist in one state subDB at a time.
 * 
 * Once an object is in a terminal state, the subDB entry is removed
 * but the object itself is not deleted from the top-level DB and 
 * can be queried by its key.
 */

export class StateMachineDB<T extends string, U> extends DB<T, U> {

  async createItem(state: T, key: string, value: U): Promise<void> {
    // TODO -- better init state handlings
    const uninitializedState = 'uninitializedState' as T
    return this.updateState(uninitializedState, state, key, value)
  }

  async updateState(oldState: T, newState: T, key: string, value: U): Promise<void> {
    let existingValue: U = {} as U
    try {
      // TODO: Handle better
      existingValue = await this.get(this.encodeKey(key))
    } catch {}
    // TODO: Don't do this as
    const updatedValue = Object.assign({} as object, value, existingValue)

    const batch: ChainedBatch<this, string, DBValue<U>>  = this.batch()
    
    // Always update the value to the top level key
    batch.put(this.encodeKey(key), updatedValue)

    // If this is the initial state, the old state will not exist and this will not be executed
    // TODO: Handle this at the DB level
    const oldStateDB = this.sublevel(oldState, KEY_ENCODING_OPTIONS)
    batch.del(this.encodeKey(key), { sublevel: oldStateDB })

    // If the terminal state is reached, do not write
    if (newState) {
      // TODO: Handle this at the DB level
      const newStateDB = this.sublevel(newState, KEY_ENCODING_OPTIONS)
      batch.put(this.encodeKey(key), updatedValue, { sublevel: newStateDB })
      console.log('writing to new state', newState, key, updatedValue)
    }

    console.log('writing state', oldState, newState, key, updatedValue)
    return batch.write()
  }

  async *getItemsInState(state: T): AsyncIterable<[string, U]> {
    // TODO: Don't do <string, U> here, do it at the DB level
    const sublevel = this.sublevel(state, KEY_ENCODING_OPTIONS)
    // TODO: Generic feels wrong
    for await (const [key, value] of sublevel.iterator<string, U>(KEY_ENCODING_OPTIONS)) {
      yield [key, value]
    }
  }
}
