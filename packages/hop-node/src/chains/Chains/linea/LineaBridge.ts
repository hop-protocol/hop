import Message from './Message'
import { IChainBridge } from '../../IChainBridge'
import AbstractBridge from '../../AbstractBridge'
import { Chain } from 'src/constants'

class LineaBridge extends AbstractBridge implements IChainBridge {
  constructor (chainSlug: Chain) {
    super(chainSlug, Message)
  }
}

export default LineaBridge
