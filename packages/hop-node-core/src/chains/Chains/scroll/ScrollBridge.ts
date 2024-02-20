import { AbstractChainBridge } from '#src/chains/AbstractChainBridge.js'
import { ScrollFinalityService } from '#src/chains/Chains/scroll/ScrollFinalityService.js'
import { ScrollMessageService } from '#src/chains/Chains/scroll/ScrollMessageService.js'

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
