import { AbstractChainBridge } from '#chains/AbstractChainBridge.js'
import { LineaFinalityService } from '#chains/Chains/linea/LineaFinalityService.js'
import { LineaMessageService } from '#chains/Chains/linea/LineaMessageService.js'

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
