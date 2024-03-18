import { ChainedBatch, DB } from './DB'

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

  async updateState(oldState: T, newState: T, key: string, value: U): Promise<void> {
    // TODO: Handle this at the DB level
    const oldStateDB = this.sublevel(oldState)
    const newStateDB = this.sublevel(newState)

    const existingValue = this.get(this.encodeKey(key))
    const updatedValue = Object.assign(existingValue, value)

    const batch: ChainedBatch<this, string, DBValue<U>>  = this.batch()
    
    // Always update the value to the top level key
    batch.put(this.encodeKey(key), updatedValue)

    // If this is the initial state, the old state will not exist and this will not be executed
    batch.del(this.encodeKey(key), { sublevel: oldStateDB })

    // If the terminal state is reached, do not write
    if (newState) {
      batch.put(this.encodeKey(key), updatedValue, { sublevel: newStateDB })
    }

    return batch.write()
  }

  async *getItemsInState(state: T): AsyncIterable<[string, U]> {
    // TODO: Don't do <string, U> here, do it at the DB level
    const sublevel = this.sublevel<string, U>(state, { valueEncoding: 'json' })
    yield* sublevel.iterator()
  }
}
