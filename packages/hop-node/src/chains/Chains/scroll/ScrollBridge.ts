import { AbstractChainBridge } from 'src/chains/AbstractChainBridge'
import { ScrollFinalityService } from 'src/chains/Chains/scroll/ScrollFinalityService'
import { ScrollMessageService } from 'src/chains/Chains/scroll/ScrollMessageService'

export class ScrollZkBridge extends AbstractChainBridge {
  constructor (chainSlug: string) {
    super({
      chainSlug,
      chainServices: {
        messageService: new ScrollMessageService(chainSlug),
        finalityService: new ScrollFinalityService(chainSlug)
      }
    })
  }
}
