import AbstractChainBridge from '../../AbstractChainBridge'
import Inclusion from './Inclusion'
import Message from './Message'
import { Chain } from 'src/constants'
import { IChainBridge } from '../../IChainBridge'

class ArbitrumBridge extends AbstractChainBridge implements IChainBridge {
  constructor (chainSlug: Chain) {
    super(chainSlug, Message, Inclusion)
  }
}

export default ArbitrumBridge
