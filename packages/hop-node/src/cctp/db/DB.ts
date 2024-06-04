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
}
