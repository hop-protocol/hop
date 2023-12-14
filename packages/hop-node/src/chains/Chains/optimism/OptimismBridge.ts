import { OptimismFinalityService } from 'src/chains/Chains/optimism/OptimismFinalityService'
import { OptimismMessageService } from 'src/chains/Chains/optimism/OptimismMessageService'
import { AbstractChainBridge } from 'src/chains/AbstractChainBridge'

export class OptimismBridge extends AbstractChainBridge {
  constructor (chainSlug: string) {
    super({
      chainSlug,
      chainServices: {
        messageService: new OptimismMessageService(chainSlug),
        finalityService: new OptimismFinalityService(chainSlug)
      }
    })
  }
}
