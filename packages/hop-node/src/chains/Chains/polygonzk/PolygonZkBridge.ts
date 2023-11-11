import Message from './Message'
import { IChainBridge } from '../../IChainBridge'
import AbstractChainBridge from '../../AbstractChainBridge'
import { Chain } from 'src/constants'

class PolygonZkBridge extends AbstractChainBridge implements IChainBridge {
  constructor (chainSlug: Chain) {
    super(chainSlug, Message)
  }
}

export default PolygonZkBridge
