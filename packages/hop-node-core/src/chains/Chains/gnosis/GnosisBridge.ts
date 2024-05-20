import { AbstractChainBridge } from '../../AbstractChainBridge.js'
import type { ChainSlug } from '@hop-protocol/sdk'
import { GnosisFinalityService } from '../../Chains/gnosis/GnosisFinalityService.js'
import { GnosisMessageService } from '../../Chains/gnosis/GnosisMessageService.js'

export class GnosisBridge extends AbstractChainBridge {
  constructor (chainSlug: ChainSlug) {
    super({
      chainSlug,
      chainServices: {
        messageService: new GnosisMessageService(chainSlug),
        finalityService: new GnosisFinalityService(chainSlug)
      }
    })
  }
}
