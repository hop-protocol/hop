import AbstractChainBridge from '../../AbstractChainBridge'
import Message from './Message'
import { Chain } from 'src/constants'
import { IChainBridge } from '../../IChainBridge'

class PolygonBridge extends AbstractChainBridge implements IChainBridge {
  constructor (chainSlug: Chain) {
    super(chainSlug, Message)
  }
}

export default PolygonBridge
