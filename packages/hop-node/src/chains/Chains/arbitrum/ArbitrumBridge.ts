import Inclusion from './Inclusion'
import Message from './Message'
import { IChainBridge } from '../../IChainBridge'
import AbstractBridge from '../../AbstractBridge'
import { Chain } from 'src/constants'

class ArbitrumBridge extends AbstractBridge implements IChainBridge {
  constructor (chainSlug: Chain) {
    super(chainSlug, Message, Inclusion)
  }
}

export default ArbitrumBridge
