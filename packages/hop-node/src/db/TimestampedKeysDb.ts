import BaseDb from './BaseDb'
import wait from 'src/utils/wait'

class TimestampedKeysDb<Type> extends BaseDb {
  ready = false
  subDb : any

  constructor (prefix: string, _namespace?: string) {
    super(prefix, _namespace)

    this.subDb = new BaseDb(`${prefix}:timestampedKeys`, _namespace)

    // this only needs to be ran once on start up to backfill timestamped keys.
    // this function can be removed once all bonders update.
    // timestamped keys (in addition to transferId as keys) are needed to filter
    // leveldb read streams.
    this.trackTimestampedKeys()
      .then(() => {
        this.ready = true
        this.logger.debug('db ready')
      })
      .catch(this.logger.error)
  }

  protected async tilReady (): Promise<boolean> {
    if (this.ready) {
      return true
    }

    await wait(100)
    return this.tilReady()
  }

  async trackTimestampedKeys () {
    const items = await this.getItems()
    for (const item of items) {
      await this.trackTimestampedKey(item)
    }
  }

  async getItems () :Promise<Type[]> {
    // implemented in child class
    return []
  }

  async trackTimestampedKey (item: Type) {
    // implemented in child class
  }
}

export default TimestampedKeysDb
