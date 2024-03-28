import { Level }  from 'level'
import { getDBPath } from './utils'

// Introduce updatedAt here if desired
interface Metadata {
  updatedAt?: string
  syncMarker?: string
}

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
  #metadataKey: string = 'metadata'

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

  /**
   * Metadata
   */

  protected async getMetadata(): Promise<Metadata> {
    return this.get<string, Metadata>(this.#metadataKey, KEY_ENCODING_OPTIONS)
  }

  protected async updateMetadata(value: Metadata): Promise<void> {
    return this.put<string, Metadata>(this.#metadataKey, value, KEY_ENCODING_OPTIONS)
  }
}
