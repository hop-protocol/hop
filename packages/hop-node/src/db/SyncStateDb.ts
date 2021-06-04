import BaseDb from './BaseDb'

export type State = {
  latestBlockSynced: number
  timestamp: number
}

class SyncStateDb extends BaseDb {
  constructor (prefix: string = 'transfers') {
    super(prefix)
  }

  async update (key: string, data: Partial<State>) {
    return super.update(key, data)
  }

  async getByKey (key: string): Promise<State> {
    return this.getById(key)
  }
}

export default SyncStateDb
