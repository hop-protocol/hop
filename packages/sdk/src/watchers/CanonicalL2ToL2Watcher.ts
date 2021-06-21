import { default as BaseWatcher, Config } from './BaseWatcher'

class L1ToL2Watcher extends BaseWatcher {
  constructor (config: Config) {
    super(config)
  }

  public watch () {
    throw new Error('not implemented')
  }
}

export default L1ToL2Watcher
