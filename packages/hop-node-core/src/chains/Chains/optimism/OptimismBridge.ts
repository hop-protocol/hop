import { AbstractChainBridge } from 'src/chains/AbstractChainBridge.js'
import { OptimismFinalityService } from 'src/chains/Chains/optimism/OptimismFinalityService.js'
import { OptimismMessageService } from 'src/chains/Chains/optimism/OptimismMessageService.js'

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
