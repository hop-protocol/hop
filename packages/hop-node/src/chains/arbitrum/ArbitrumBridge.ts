import AbstractArbitrumBridge from './AbstractArbitrumBridge'
import { Chain } from 'src/constants'

class ArbitrumBridge extends AbstractArbitrumBridge {
  constructor () {
    super(Chain.Arbitrum)
  }
}

export default ArbitrumBridge
