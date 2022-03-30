import BaseDb from './BaseDb'

export type State = {
  key: string
  latestBlockSynced: number
  timestamp: number
  _createdAt: number
}

// structure:
// key: `<chainId>:<address>:<eventName>`
// value: `{ ...State }`
class SyncStateDb extends BaseDb {
  async migration () {
    this.logger.debug('SyncStateDb migration started')
    const entries = await this.getItems()
    const timestamp = Date.now()
    for (const entry of entries) {
      // delete existing MultipleWithdrawalsSettled keys to force
      // a re-sync of all MultipleWithdrawalsSettled events
      const shouldDelete = entry._createdAt < timestamp && entry.key.endsWith('MultipleWithdrawalsSettled') && !entry.key.startsWith('migration')
      if (shouldDelete) {
        // keep track of when this migration has been ran so it
        // doesn't re-sync from beginning on every restart
        const migrationKey = `migration:001:${entry.key}`
        const alreadyMigrated = await this.getByKey(migrationKey)
        if (alreadyMigrated) {
          continue
        }

        await this.update(migrationKey, { timestamp })
        this.logger.debug(`SyncStateDb migration deleted key ${entry.key}`)
        await this.deleteById(entry.key)
      }
    }
    this.logger.debug('SyncStateDb migration done')
  }

  async update (key: string, data: Partial<State>) {
    if (!data.key) {
      data.key = key
    }
    await this._update(key, data)
    const entry = await this.getById(key)
    this.logger.debug(`updated db syncState item. ${JSON.stringify(entry)}`)
  }

  normalizeValue (key: string, value: State) {
    if (value) {
      value.key = key
    }
    return value
  }

  async getByKey (key: string): Promise<State> {
    const item: State = await this.getById(key)
    return this.normalizeValue(key, item)
  }

  async getItems (): Promise<State[]> {
    const items: State[] = await this.getValues()
    return items.filter(x => x)
  }
}

export default SyncStateDb
