import { AbstractChainBridge } from '../../AbstractChainBridge.js'
import type { ChainSlug } from '@hop-protocol/sdk'
import { LineaFinalityService } from '../../Chains/linea/LineaFinalityService.js'
import { LineaMessageService } from '../../Chains/linea/LineaMessageService.js'

export class LineaBridge extends AbstractChainBridge {
  constructor (chainSlug: ChainSlug) {
    super({
      chainSlug,
      chainServices: {
        messageService: new LineaMessageService(chainSlug),
        finalityService: new LineaFinalityService(chainSlug)
      }
    })
  }
}
