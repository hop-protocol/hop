import { DB } from './DB'

/**
 * SyncDB adds a syncMarker to the DB Metadata.
 */

interface Metadata {
  syncMarker: string
}

export class SyncDB<K, V> extends DB<K, V, Metadata> {
  async getSyncMarker (): Promise<string> {
    const metadata = await this.getMetadata()
    if (metadata?.syncMarker === undefined) {
      throw new Error('Sync marker not found')
    }
    return metadata.syncMarker
  }

  async updateSyncMarker(value: Metadata): Promise<void> {
    return this.updateMetadata(value)
  }
}
