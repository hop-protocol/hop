import { AbstractChainBridge } from '#src/chains/AbstractChainBridge.js'
import { PolygonZkFinalityService } from '#src/chains/Chains/polygonzk/PolygonZkFinalityService.js'
import { PolygonZkMessageService } from '#src/chains/Chains/polygonzk/PolygonZkMessageService.js'

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
