import { AbstractChainBridge } from 'src/chains/AbstractChainBridge'
import { LineaFinalityService } from 'src/chains/Chains/linea/LineaFinalityService'
import { LineaMessageService } from 'src/chains/Chains/linea/LineaMessageService'

export class LineaBridge extends AbstractChainBridge {
  constructor (chainSlug: string) {
    super({
      chainSlug,
      chainServices: {
        messageService: new LineaMessageService(chainSlug),
        finalityService: new LineaFinalityService(chainSlug)
      }
    })
  }
}
