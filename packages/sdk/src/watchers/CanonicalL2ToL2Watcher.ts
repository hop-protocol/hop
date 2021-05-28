import {
  default as BaseWatcher,
  Config,
  WatchOptions,
  Event
} from './BaseWatcher'
import { TChain, TToken, TProvider } from '../types'
import { Chain } from '../models'

class L1ToL2Watcher extends BaseWatcher {
  constructor (config: Config) {
    super(config)
  }

  public watch () {
    throw new Error('not implemented')
  }
}

export default L1ToL2Watcher
