import { AbstractChainBridge } from '#src/chains/AbstractChainBridge.js'
import { LineaFinalityService } from '#src/chains/Chains/linea/LineaFinalityService.js'
import { LineaMessageService } from '#src/chains/Chains/linea/LineaMessageService.js'

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
