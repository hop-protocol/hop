import AbstractArbitrumBridgeWatcher from './AbstractArbitrumBridgeWatcher'
import { Chain } from 'src/constants'

class ArbitrumBridgeWatcher extends AbstractArbitrumBridgeWatcher {
  constructor () {
    super(Chain.Arbitrum)
  }
}

export default ArbitrumBridgeWatcher
