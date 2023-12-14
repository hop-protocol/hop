import { PolygonZkFinalityService } from 'src/chains/Chains/polygonzk/PolygonZkFinalityService'
import { PolygonZkMessageService } from 'src/chains/Chains/polygonzk/PolygonZkMessageService'
import { AbstractChainBridge } from 'src/chains/AbstractChainBridge'

export class PolygonZkBridge extends AbstractChainBridge {
  constructor (chainSlug: string) {
    super({
      chainSlug,
      chainServices: {
        MessageService: PolygonZkMessageService,
        FinalityService: PolygonZkFinalityService
      }
    })
  }
}
