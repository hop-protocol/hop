import { ArbitrumInclusionService } from 'src/chains/Chains/arbitrum/ArbitrumInclusionService'
import { ArbitrumMessageService } from 'src/chains/Chains/arbitrum/ArbitrumMessageService'
import { AbstractChainBridge } from 'src/chains/AbstractChainBridge'

export class ArbitrumBridge extends AbstractChainBridge {
  constructor (chainSlug: string) {
    super({
      chainSlug,
      chainServices: {
        MessageService: ArbitrumMessageService,
        InclusionService: ArbitrumInclusionService
      }
    })
  }
}
