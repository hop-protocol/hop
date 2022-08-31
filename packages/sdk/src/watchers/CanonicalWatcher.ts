import Base from '../Base'
import CanonicalL1ToL2Watcher from './CanonicalL1ToL2Watcher'
import CanonicalL2ToL1Watcher from './CanonicalL2ToL1Watcher'
import CanonicalL2ToL2Watcher from './CanonicalL2ToL2Watcher'
import EventEmitter from 'eventemitter3'
import { Config } from './BaseWatcher'

class Watcher extends Base {
  watcher: CanonicalL1ToL2Watcher | CanonicalL2ToL1Watcher | CanonicalL2ToL2Watcher

  constructor (config: Config) {
    super(config.network, config.signer, config.chainProviders)
    let { sourceChain, destinationChain } = config
    sourceChain = this.toChainModel(sourceChain)
    destinationChain = this.toChainModel(destinationChain)

    // L1 -> L2
    if (sourceChain.isL1) {
      this.watcher = new CanonicalL1ToL2Watcher(config)
    }

    // L2 -> L1
    if (!sourceChain.isL1 && destinationChain?.isL1) {
      this.watcher = new CanonicalL2ToL1Watcher(config)
    }

    // L2 -> L2
    if (!sourceChain.isL1 && !destinationChain?.isL1) {
      this.watcher = new CanonicalL2ToL2Watcher(config)
    }
  }

  watch (): EventEmitter | Error {
    if (!this.watcher) {
      throw new Error('not implemented')
    }

    return this.watcher.watch()
  }
}

export default Watcher
