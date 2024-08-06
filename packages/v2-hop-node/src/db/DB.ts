import { Level } from 'level'
import { getDBPath } from './utils.js'
import { Logger } from '#logger/index.js'

interface DatabaseOptions {
  keyEncoding: string
  valueEncoding: string
}

// TODO: Optimize: Binary
const DB_OPTS: DatabaseOptions = {
  keyEncoding: 'utf8',
  valueEncoding: 'json'
}

export abstract class DB<K extends string, V> extends Level<K, V> {
  protected readonly logger: Logger

  constructor (name: string) {
    super(getDBPath(name), DB_OPTS)
    this.logger = new Logger({
      tag: name,
      color: 'cyan'
    })
  }

  // TODO: Optimize: I shouldn't have to call getMany. But if I override get()
  // then I cannot call it...
  // TODO: Optimize: When this is better understood, add comment that this exists
  // in order to provide a trace to a failed `get()`.
  override async get (key: K): Promise<V> {
    const res = (await super.getMany([key], DB_OPTS))[0]
    if (!res) {
      throw new Error(`DB Error: get() for key: ${key}`)
    }
    return res
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
    return this.sublevel(sublevelName, DB_OPTS)
  }
}
