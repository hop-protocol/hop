import { AbstractChainBridge } from '../../AbstractChainBridge'
import { Chain } from 'src/constants'
import { IChainBridge } from '../../IChainBridge'
import { ScrollMessageService } from './Message'

export class ScrollBridge extends AbstractChainBridge implements IChainBridge {
  chainSlug = Chain.ScrollZk
  message = new ScrollMessageService()
}
