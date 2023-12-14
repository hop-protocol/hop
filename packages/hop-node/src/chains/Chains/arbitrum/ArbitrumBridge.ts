import { AbstractChainBridge } from 'src/chains/AbstractChainBridge'
import { ArbitrumMessageService } from 'src/chains/Chains/arbitrum/ArbitrumMessageService'

export class ArbitrumBridge extends AbstractChainBridge {
  constructor (chainSlug: string) {
    super({
      chainSlug,
      chainServices: {
        messageService: new ArbitrumMessageService(chainSlug)
      }
    })
  }
}
