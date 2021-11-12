import BaseDb from './BaseDb'
import chainSlugToId from 'src/utils/chainSlugToId'
import wait from 'src/utils/wait'
import { Chain } from 'src/constants'

export type State = {
  key: string
  latestBlockSynced: number
  timestamp: number
}

class SyncStateDb extends BaseDb {
  ready: boolean = false

  constructor (prefix: string, _namespace?: string) {
    super(prefix, _namespace)
    this.migrations()
      .then(() => { this.ready = true })
      .catch(this.logger.error)
  }

  async migrations () {
    const items = await this.getKeyValues()
    for (const { key, value } of items) {
      if (key?.startsWith(`${chainSlugToId(Chain.Optimism)}:`)) {
        await this._update(key, Object.assign({}, value, {
          latestBlockSynced: 0,
          timestamp: Date.now()
        }))
        this.logger.debug(`${key} updated latestBlockSynced to 0`)
      }
    }
  }

  protected async tilReady (): Promise<boolean> {
    if (this.ready) {
      return true
    }

    await wait(100)
    return await this.tilReady()
  }

  async update (key: string, data: Partial<State>) {
    await this.tilReady()
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
    await this.tilReady()
    const item: State = await this.getById(key)
    return this.normalizeValue(key, item)
  }

  async getItems (): Promise<State[]> {
    await this.tilReady()
    const items: State[] = await this.getValues()
    return items.filter(x => x)
  }
}

export default SyncStateDb
