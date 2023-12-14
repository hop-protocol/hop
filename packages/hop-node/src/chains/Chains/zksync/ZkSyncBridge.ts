import { ZkSyncMessageService } from 'src/chains/Chains/zksync/ZkSyncMessageService'
import { AbstractChainBridge } from 'src/chains/AbstractChainBridge'

export class ZkSyncBridge extends AbstractChainBridge {
  constructor (chainSlug: string) {
    super({
      chainSlug,
      chainServices: {
        MessageService: ZkSyncMessageService
      }
    })
  }
}
