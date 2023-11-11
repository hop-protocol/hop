import Inclusion from './Inclusion'
import Message from './Message'
import { IChainBridge } from '../../IChainBridge'
import AbstractChainBridge from '../../AbstractChainBridge'
import { Chain } from 'src/constants'

class ArbitrumBridge extends AbstractChainBridge implements IChainBridge {
  constructor (chainSlug: Chain) {
    super(chainSlug, Message, Inclusion)
  }
}

export default ArbitrumBridge
