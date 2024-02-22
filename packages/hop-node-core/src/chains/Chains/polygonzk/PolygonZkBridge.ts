import { AbstractChainBridge } from '#chains/AbstractChainBridge.js'
import { PolygonZkFinalityService } from '#chains/Chains/polygonzk/PolygonZkFinalityService.js'
import { PolygonZkMessageService } from '#chains/Chains/polygonzk/PolygonZkMessageService.js'

export class PolygonZkBridge extends AbstractChainBridge {
  constructor (chainSlug: string) {
    super({
      chainSlug,
      chainServices: {
        messageService: new PolygonZkMessageService(chainSlug),
        finalityService: new PolygonZkFinalityService(chainSlug)
      }
    })
  }
}
