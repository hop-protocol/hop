import { AbstractChainBridge } from '../../AbstractChainBridge.js'
import { ZkSyncFinalityService } from '../../Chains/zksync/ZkSyncFinalityService.js'
import { ZkSyncMessageService } from '../../Chains/zksync/ZkSyncMessageService.js'

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
