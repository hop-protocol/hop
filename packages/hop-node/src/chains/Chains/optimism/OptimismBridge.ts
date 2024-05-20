import { AbstractChainBridge } from '../../AbstractChainBridge.js'
import type { ChainSlug } from '@hop-protocol/sdk'
import { OptimismFinalityService } from '../../Chains/optimism/OptimismFinalityService.js'
import { OptimismMessageService } from '../../Chains/optimism/OptimismMessageService.js'

export class OptimismBridge extends AbstractChainBridge {
  constructor (chainSlug: ChainSlug) {
    super({
      chainSlug,
      chainServices: {
        messageService: new OptimismMessageService(chainSlug),
        finalityService: new OptimismFinalityService(chainSlug)
      }
    })
  }
}
