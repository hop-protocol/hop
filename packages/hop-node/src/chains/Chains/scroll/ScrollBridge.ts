import { ScrollMessageService } from 'src/chains/Chains/scroll/ScrollMessageService'
import { AbstractChainBridge } from 'src/chains/AbstractChainBridge'

export class ScrollZkBridge extends AbstractChainBridge {
  constructor (chainSlug: string) {
    super({
      chainSlug,
      chainServices: {
        messageService: new ScrollMessageService(chainSlug)
      }
    })
  }
}