import { AbstractChainBridge } from '../../AbstractChainBridge.js'
import { ArbitrumFinalityService } from '../../Chains/arbitrum/ArbitrumFinalityService.js'
import { ArbitrumMessageService } from '../../Chains/arbitrum/ArbitrumMessageService.js'

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
