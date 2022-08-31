import { default as BaseWatcher } from './BaseWatcher'

class L1ToL2Watcher extends BaseWatcher {
  public watch (): Error {
    throw new Error('not implemented')
  }
}

export default L1ToL2Watcher
