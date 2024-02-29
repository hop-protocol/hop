import { AbstractChainBridge } from '../../AbstractChainBridge.js'
import { OptimismFinalityService } from '../../Chains/optimism/OptimismFinalityService.js'
import { OptimismMessageService } from '../../Chains/optimism/OptimismMessageService.js'

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
