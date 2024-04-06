import { BaseDb } from '../BaseDb'

export interface SyncState {
  fromBlock: number
  toBlock: number
}

export class SyncStateDb extends BaseDb {
  constructor (dbPath: string, dbName: string) {
    super(dbPath, `syncState:${dbName}`)
  }

  getKeyString (chainId: number) {
    return `${chainId}`
  }

  async putSyncState (chainId: number, state: SyncState): Promise<boolean> {
    const key = this.getKeyString(chainId)
    await this._put(key, state)
    return true
  }

  async getSyncState (chainId: number): Promise<SyncState | null> {
    const key = this.getKeyString(chainId)
    return this._get(key)
  }

  async resetSyncState (chainId: number): Promise<boolean> {
    const key = this.getKeyString(chainId)
    await this._delete(key)
    return true
  }
}
