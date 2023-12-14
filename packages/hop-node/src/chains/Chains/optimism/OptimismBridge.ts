import { OptimismFinalityService } from 'src/chains/Chains/optimism/OptimismFinalityService'
import { OptimismInclusionService } from 'src/chains/Chains/optimism/OptimismInclusionService'
import { OptimismMessageService } from 'src/chains/Chains/optimism/OptimismMessageService'
import { AbstractChainBridge } from 'src/chains/AbstractChainBridge'

export class OptimismBridge extends AbstractChainBridge {
  constructor (chainSlug: string) {
    super({
      chainSlug,
      chainServices: {
        MessageService: OptimismMessageService,
        InclusionService: OptimismInclusionService,
        FinalityService: OptimismFinalityService
      }
    })
  }
}
