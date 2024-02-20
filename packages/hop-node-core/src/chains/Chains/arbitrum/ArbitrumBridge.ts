import { AbstractChainBridge } from 'src/chains/AbstractChainBridge.js'
import { ArbitrumFinalityService } from 'src/chains/Chains/arbitrum/ArbitrumFinalityService.js'
import { ArbitrumMessageService } from 'src/chains/Chains/arbitrum/ArbitrumMessageService.js'

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
