import { AbstractChainBridge } from '../../AbstractChainBridge.js'
import { PolygonFinalityService } from '../../Chains/polygon/PolygonFinalityService.js'
import { PolygonMessageService } from '../../Chains/polygon/PolygonMessageService.js'

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
