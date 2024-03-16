import { ClassicLevel } from 'classic-level'
import { getDbPathForNameOrLocation } from './utils'
export { type ChainedBatch } from 'classic-level'

interface DatabaseOptions {
  keyEncoding: string
  valueEncoding: string
}

// TODO: Binary?
const KEY_ENCODING_OPTIONS: DatabaseOptions = {
  keyEncoding: 'utf8',
  valueEncoding: 'json'
}

// TODO: Should we cache the DB instance?
export abstract class DB<T extends string, U> extends ClassicLevel<T, U> {
  constructor (dbNameOrLocation: string) {
    super(getDbPathForNameOrLocation(dbNameOrLocation), KEY_ENCODING_OPTIONS)
  }

  // TODO: Possibly override methods and type instead of this. Gets tricky with batch but
  // cleaner than encoding every key in each implementation.
  // TODO: If this is kept, don't use the word encode
  encodeKey(key: string): T {
    return key as T
  }
}
