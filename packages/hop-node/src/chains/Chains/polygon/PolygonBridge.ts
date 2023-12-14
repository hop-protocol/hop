import { PolygonMessageService } from 'src/chains/Chains/polygon/PolygonMessageService'
import { AbstractChainBridge } from 'src/chains/AbstractChainBridge'

export class PolygonBridge extends AbstractChainBridge {
  constructor (chainSlug: string) {
    super({
      chainSlug,
      chainServices: {
        MessageService: PolygonMessageService,
      }
    })
  }
}
