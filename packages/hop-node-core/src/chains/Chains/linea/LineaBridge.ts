import { AbstractChainBridge } from '../../AbstractChainBridge.js'
import { LineaFinalityService } from '../../Chains/linea/LineaFinalityService.js'
import { LineaMessageService } from '../../Chains/linea/LineaMessageService.js'

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
