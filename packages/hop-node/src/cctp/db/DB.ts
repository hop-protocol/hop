import { Level }  from 'level'
import { getDBPath } from './utils.js'
import { Logger } from '#logger/index.js'

interface DatabaseOptions {
  keyEncoding: string
  valueEncoding: string
}

// TODO: Optimize: Binary
const KEY_ENCODING_OPTIONS: DatabaseOptions = {
  keyEncoding: 'utf8',
  valueEncoding: 'json'
}

export abstract class DB<K, V> extends Level<K, V> {
  protected readonly logger: Logger

  constructor (name: string) {
    super(getDBPath(name), KEY_ENCODING_OPTIONS)
    this.logger = new Logger({
      tag: name,
      color: 'cyan'
    })
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

  // TODO: Optimize: Not any
  protected getSublevel(sublevelName: string): any {
    return this.sublevel(sublevelName, {
      keyEncoding: KEY_ENCODING_OPTIONS.keyEncoding,
      valueEncoding: KEY_ENCODING_OPTIONS.valueEncoding
    })
  }
}
