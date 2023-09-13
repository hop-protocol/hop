import AbstractOptimismBridgeWatcher from './AbstractOptimismBridgeWatcher'
import { Chain } from 'src/constants'

class BaseZkBridgeWatcher extends AbstractOptimismBridgeWatcher {
  constructor () {
    super(Chain.Base)
  }
}

export default BaseZkBridgeWatcher
