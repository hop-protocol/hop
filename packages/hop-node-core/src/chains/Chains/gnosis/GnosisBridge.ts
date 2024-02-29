import { AbstractChainBridge } from '../../AbstractChainBridge.js'
import { GnosisFinalityService } from '../../Chains/gnosis/GnosisFinalityService.js'
import { GnosisMessageService } from '../../Chains/gnosis/GnosisMessageService.js'

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
