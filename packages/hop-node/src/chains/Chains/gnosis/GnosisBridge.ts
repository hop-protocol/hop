import { AbstractChainBridge } from 'src/chains/AbstractChainBridge'
import { GnosisFinalityService } from 'src/chains/Chains/gnosis/GnosisFinalityService'
import { GnosisMessageService } from 'src/chains/Chains/gnosis/GnosisMessageService'

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
