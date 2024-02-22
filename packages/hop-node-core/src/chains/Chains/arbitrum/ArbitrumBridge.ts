import { AbstractChainBridge } from '#chains/AbstractChainBridge.js'
import { ArbitrumFinalityService } from '#chains/Chains/arbitrum/ArbitrumFinalityService.js'
import { ArbitrumMessageService } from '#chains/Chains/arbitrum/ArbitrumMessageService.js'

export class ArbitrumBridge extends AbstractChainBridge {
  constructor (chainSlug: string) {
    super({
      chainSlug,
      chainServices: {
        messageService: new ArbitrumMessageService(chainSlug),
        finalityService: new ArbitrumFinalityService(chainSlug)
      }
    })
  }
}
