import AbstractOptimismBridge from './AbstractOptimismBridge'
import { Chain } from 'src/constants'

class BaseBridge extends AbstractOptimismBridge {
  constructor () {
    super(Chain.Base)
  }
}

export default BaseBridge
