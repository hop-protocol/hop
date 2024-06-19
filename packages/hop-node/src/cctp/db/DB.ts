import { Level }  from 'level'
import { getDBPath } from './utils.js'

interface DatabaseOptions {
  keyEncoding: string
  valueEncoding: string
}

// TODO: Binary
const KEY_ENCODING_OPTIONS: DatabaseOptions = {
  keyEncoding: 'utf8',
  valueEncoding: 'json'
}

export abstract class DB<K, V> extends Level<K, V> {
  constructor (name: string) {
    super(getDBPath(name), KEY_ENCODING_OPTIONS)
  }

  protected async getIfExists(key: K): Promise<V | null> {
    try {
      return (await this.get(key))
    } catch (e) {
      return null
    }
  }

  protected async has(key: K): Promise<boolean> {
    return (await this.getIfExists(key)) !== null
  }

  // TODO: Possibly better way to do this? the reason this exists is to 
  // return JSON objects when getting from sublevels without needing to
  // add explicit options throughout the codebase
  // TODO: Not any
  protected getSublevel(sublevelName: string): any {
    return this.sublevel(sublevelName, {
      keyEncoding: KEY_ENCODING_OPTIONS.keyEncoding,
      valueEncoding: KEY_ENCODING_OPTIONS.valueEncoding
    })
  }
}
