import { AbstractChainBridge } from 'src/chains/AbstractChainBridge'
import { ZkSyncFinalityService } from 'src/chains/Chains/zksync/ZkSyncFinalityService'
import { ZkSyncMessageService } from 'src/chains/Chains/zksync/ZkSyncMessageService'

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
