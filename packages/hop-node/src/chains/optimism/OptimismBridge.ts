import AbstractOptimismBridge from './AbstractOptimismBridge'
import { Chain } from 'src/constants'

class OptimismBridge extends AbstractOptimismBridge {
  constructor () {
    super(Chain.Optimism)
  }
}

export default OptimismBridge
