import { AbstractChainBridge } from '../../AbstractChainBridge.js'
import type { ChainSlug } from '@hop-protocol/sdk'
import { ZkSyncFinalityService } from '../../Chains/zksync/ZkSyncFinalityService.js'
import { ZkSyncMessageService } from '../../Chains/zksync/ZkSyncMessageService.js'

export class ZkSyncBridge extends AbstractChainBridge {
  constructor (chainSlug: ChainSlug) {
    super({
      chainSlug,
      chainServices: {
        messageService: new ZkSyncMessageService(chainSlug),
        finalityService: new ZkSyncFinalityService(chainSlug)
      }
    })
  }
}
