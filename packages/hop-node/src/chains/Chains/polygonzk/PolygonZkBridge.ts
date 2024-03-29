import { AbstractChainBridge } from 'src/chains/AbstractChainBridge'
import { PolygonZkFinalityService } from 'src/chains/Chains/polygonzk/PolygonZkFinalityService'
import { PolygonZkMessageService } from 'src/chains/Chains/polygonzk/PolygonZkMessageService'

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
