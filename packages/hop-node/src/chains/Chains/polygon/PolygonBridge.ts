import { AbstractChainBridge } from 'src/chains/AbstractChainBridge'
import { PolygonMessageService } from 'src/chains/Chains/polygon/PolygonMessageService'
import { PolygonFinalityService } from 'src/chains/Chains/polygon/PolygonFinalityService'

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
