import { AbstractChainBridge } from '#chains/AbstractChainBridge.js'
import { GnosisFinalityService } from '#chains/Chains/gnosis/GnosisFinalityService.js'
import { GnosisMessageService } from '#chains/Chains/gnosis/GnosisMessageService.js'

export class GnosisBridge extends AbstractChainBridge {
  constructor (chainSlug: string) {
    super({
      chainSlug,
      chainServices: {
        messageService: new GnosisMessageService(chainSlug),
        finalityService: new GnosisFinalityService(chainSlug)
      }
    })
  }
}
