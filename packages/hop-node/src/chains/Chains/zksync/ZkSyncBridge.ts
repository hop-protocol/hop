import { Chain } from 'src/constants'
import { ChainBridgeParams } from 'src/chains/ChainBridge'
import { ZkSyncMessageService } from 'src/chains/Chains/zksync/ZkSyncMessageService'

export const ZkSyncBridgeParams: ChainBridgeParams = {
  chainSlug: Chain.ZkSync,
  Message: ZkSyncMessageService
}
