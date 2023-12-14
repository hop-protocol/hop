import { AbstractChainBridge } from 'src/chains/AbstractChainBridge'
import { PolygonMessageService } from 'src/chains/Chains/polygon/PolygonMessageService'

export class PolygonBridge extends AbstractChainBridge {
  constructor (chainSlug: string) {
    super({
      chainSlug,
      chainServices: {
        messageService: new PolygonMessageService(chainSlug)
      }
    })
  }
}
