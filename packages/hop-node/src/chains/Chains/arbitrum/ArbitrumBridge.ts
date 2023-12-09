import { AbstractChainBridge } from '../../AbstractChainBridge'
import { ArbitrumInclusionService } from './Inclusion'
import { ArbitrumMessageService } from './Message'
import { Chain } from 'src/constants'
import { IChainBridge } from '../../IChainBridge'

export class ArbitrumBridge extends AbstractChainBridge implements IChainBridge {
  chainSlug = Chain.Arbitrum
  message = new ArbitrumMessageService()
  inclusion = new ArbitrumInclusionService()
}
