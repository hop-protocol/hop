import { AbstractChainBridge } from '#chains/AbstractChainBridge.js'
import { PolygonFinalityService } from '#chains/Chains/polygon/PolygonFinalityService.js'
import { PolygonMessageService } from '#chains/Chains/polygon/PolygonMessageService.js'

export class PolygonBridge extends AbstractChainBridge {
  constructor (chainSlug: string) {
    super({
      chainSlug,
      chainServices: {
        messageService: new PolygonMessageService(chainSlug),
        finalityService: new PolygonFinalityService(chainSlug)
      }
    })
  }
}
