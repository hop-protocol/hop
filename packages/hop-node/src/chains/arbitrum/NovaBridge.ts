import AbstractArbitrumBridge from './AbstractArbitrumBridge'
import { Chain } from 'src/constants'

class NovaBridge extends AbstractArbitrumBridge {
  constructor () {
    super(Chain.Nova)
  }
}

export default NovaBridge
