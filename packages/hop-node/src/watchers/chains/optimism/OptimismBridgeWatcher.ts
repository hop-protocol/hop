import AbstractOptimismBridgeWatcher from './AbstractOptimismBridgeWatcher'
import { Chain } from 'src/constants'

class OptimismBridgeWatcher extends AbstractOptimismBridgeWatcher {
  constructor () {
    super(Chain.Optimism)
  }
}

export default OptimismBridgeWatcher
