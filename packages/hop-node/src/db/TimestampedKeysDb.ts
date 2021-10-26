import BaseDb from './BaseDb'
import wait from 'src/utils/wait'

class TimestampedKeysDb<Type> extends BaseDb {
  ready = false
  subDb: any

  constructor (prefix: string, _namespace?: string) {
    super(prefix, _namespace)

    this.subDb = new BaseDb(`${prefix}:timestampedKeys`, _namespace)
    this.ready = true
  }

  protected async tilReady (): Promise<boolean> {
    if (this.ready) {
      return true
    }

    await wait(100)
    return await this.tilReady()
  }

  async trackTimestampedKeys () {
    const items = await this.getItems()
    for (const item of items) {
      await this.trackTimestampedKey(item)
    }
  }

  async getItems (): Promise<Type[]> {
    // implemented in child class
    return []
  }

  async trackTimestampedKey (item: Type) {
    // implemented in child class
  }
}

export default TimestampedKeysDb
