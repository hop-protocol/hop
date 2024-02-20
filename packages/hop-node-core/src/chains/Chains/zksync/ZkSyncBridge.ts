import { AbstractChainBridge } from '#src/chains/AbstractChainBridge.js'
import { ZkSyncFinalityService } from '#src/chains/Chains/zksync/ZkSyncFinalityService.js'
import { ZkSyncMessageService } from '#src/chains/Chains/zksync/ZkSyncMessageService.js'

export class ZkSyncBridge extends AbstractChainBridge {
  constructor (chainSlug: string) {
    super({
      chainSlug,
      chainServices: {
        messageService: new ZkSyncMessageService(chainSlug),
        finalityService: new ZkSyncFinalityService(chainSlug)
      }
    })
  }
}
