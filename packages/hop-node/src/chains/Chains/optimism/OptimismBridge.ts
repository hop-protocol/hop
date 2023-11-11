import AbstractChainBridge from '../../AbstractChainBridge'
import Finality from './Finality'
import Inclusion from './Inclusion'
import Message from './Message'
import { Chain } from 'src/constants'
import { IChainBridge } from '../../IChainBridge'

class OptimismBridge extends AbstractChainBridge implements IChainBridge {
  constructor (chainSlug: Chain) {
    super(chainSlug, Message, Inclusion, Finality)
  }
}

export default OptimismBridge
