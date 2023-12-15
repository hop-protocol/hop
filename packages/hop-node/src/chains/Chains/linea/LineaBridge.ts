import { AbstractChainBridge } from 'src/chains/AbstractChainBridge'
import { LineaMessageService } from 'src/chains/Chains/linea/LineaMessageService'
import { LineaFinalityService } from 'src/chains/Chains/linea/LineaFinalityService'

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
