import { ArbitrumFinalityService } from 'src/chains/Chains/arbitrum/ArbitrumFinalityService'
import { ArbitrumMessageService } from 'src/chains/Chains/arbitrum/ArbitrumMessageService'
import { AbstractChainBridge } from 'src/chains/AbstractChainBridge'

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
