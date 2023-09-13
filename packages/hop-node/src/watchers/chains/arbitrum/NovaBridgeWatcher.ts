import AbstractArbitrumBridgeWatcher from './AbstractArbitrumBridgeWatcher'
import { Chain } from 'src/constants'

class NovaBridgeWatcher extends AbstractArbitrumBridgeWatcher {
  constructor () {
    super(Chain.Nova)
  }
}

export default NovaBridgeWatcher
