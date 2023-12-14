import { AbstractChainBridge } from 'src/chains/AbstractChainBridge'
import { ZkSyncMessageService } from 'src/chains/Chains/zksync/ZkSyncMessageService'

export class ZkSyncBridge extends AbstractChainBridge {
  constructor (chainSlug: string) {
    super({
      chainSlug,
      chainServices: {
        messageService: new ZkSyncMessageService(chainSlug)
      }
    })
  }
}
