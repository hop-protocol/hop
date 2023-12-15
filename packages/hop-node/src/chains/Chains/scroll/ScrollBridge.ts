import { AbstractChainBridge } from 'src/chains/AbstractChainBridge'
import { ScrollMessageService } from 'src/chains/Chains/scroll/ScrollMessageService'
import { ScrollFinalityService } from 'src/chains/Chains/scroll/ScrollFinalityService'

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
