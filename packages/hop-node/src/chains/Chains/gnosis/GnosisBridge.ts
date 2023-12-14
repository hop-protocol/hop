import { GnosisMessageService } from 'src/chains/Chains/gnosis/GnosisMessageService'
import { AbstractChainBridge } from 'src/chains/AbstractChainBridge'

export class GnosisBridge extends AbstractChainBridge {
  constructor (chainSlug: string) {
    super({
      chainSlug,
      chainServices: {
        MessageService: GnosisMessageService,
      }
    })
  }
}
