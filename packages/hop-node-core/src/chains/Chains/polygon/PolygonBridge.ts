import { AbstractChainBridge } from '../../AbstractChainBridge.js'
import type { ChainSlug } from '@hop-protocol/sdk'
import { PolygonFinalityService } from '../../Chains/polygon/PolygonFinalityService.js'
import { PolygonMessageService } from '../../Chains/polygon/PolygonMessageService.js'

export class PolygonBridge extends AbstractChainBridge {
  constructor (chainSlug: ChainSlug) {
    super({
      chainSlug,
      chainServices: {
        messageService: new PolygonMessageService(chainSlug),
        finalityService: new PolygonFinalityService(chainSlug)
      }
    })
  }
}
