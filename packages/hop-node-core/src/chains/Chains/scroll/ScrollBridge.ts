import { AbstractChainBridge } from '../../AbstractChainBridge.js'
import type { ChainSlug } from '@hop-protocol/sdk'
import { ScrollFinalityService } from '../../Chains/scroll/ScrollFinalityService.js'
import { ScrollMessageService } from '../../Chains/scroll/ScrollMessageService.js'

export class ScrollZkBridge extends AbstractChainBridge {
  constructor (chainSlug: ChainSlug) {
    super({
      chainSlug,
      chainServices: {
        messageService: new ScrollMessageService(chainSlug),
        finalityService: new ScrollFinalityService(chainSlug)
      }
    })
  }
}
