import Finality from './Finality'
import Inclusion from './Inclusion'
import Message from './Message'
import { IChainBridge } from '../../IChainBridge'
import AbstractChainBridge from '../../AbstractChainBridge'
import { Chain } from 'src/constants'

class OptimismBridge extends AbstractChainBridge implements IChainBridge {
  constructor (chainSlug: Chain) {
    super(chainSlug, Message, Inclusion, Finality)
  }
}

export default OptimismBridge
