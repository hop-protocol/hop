import { AbstractChainBridge } from '#chains/AbstractChainBridge.js'
import { ScrollFinalityService } from '#chains/Chains/scroll/ScrollFinalityService.js'
import { ScrollMessageService } from '#chains/Chains/scroll/ScrollMessageService.js'

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
