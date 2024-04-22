import { AbstractChainBridge } from '../../AbstractChainBridge.js'
import { PolygonZkFinalityService } from '../../Chains/polygonzk/PolygonZkFinalityService.js'
import { PolygonZkMessageService } from '../../Chains/polygonzk/PolygonZkMessageService.js'

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
