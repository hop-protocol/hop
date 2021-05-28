import { Config } from './BaseWatcher'
import Base from '../Base'
import L1ToL2Watcher from './L1ToL2Watcher'
import L2ToL1Watcher from './L2ToL1Watcher'
import L2ToL2Watcher from './L2ToL2Watcher'

class Watcher extends Base {
  watcher: any

  constructor (config: Config) {
    super(config.network, config.signer)
    let { sourceChain, destinationChain } = config
    sourceChain = this.toChainModel(sourceChain)
    destinationChain = this.toChainModel(destinationChain)

    // L1 -> L2
    if (sourceChain.isL1) {
      this.watcher = new L1ToL2Watcher(config)
    }

    // L2 -> L1
    if (!sourceChain.isL1 && destinationChain?.isL1) {
      this.watcher = new L2ToL1Watcher(config)
    }

    // L2 -> L2
    if (!sourceChain.isL1 && !destinationChain?.isL1) {
      this.watcher = new L2ToL2Watcher(config)
    }
  }

  watch () {
    if (!this.watcher) {
      throw new Error('not implemented')
    }

    return this.watcher.watch()
  }
}

export default Watcher
