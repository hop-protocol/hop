import { LineaMessageService } from 'src/chains/Chains/linea/LineaMessageService'
import { AbstractChainBridge } from 'src/chains/AbstractChainBridge'

export class LineaBridge extends AbstractChainBridge {
  constructor (chainSlug: string) {
    super({
      chainSlug,
      chainServices: {
        MessageService: LineaMessageService
      }
    })
  }
}
