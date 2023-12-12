import { Chain } from 'src/constants'
import { ZkSyncMessageService } from 'src/chains/Chains/zksync/ZkSyncMessageService'
import { createChainBridgeClass } from 'src/chains/Factories/ChainBridgeFactory'

export const ZkSyncBridge = createChainBridgeClass(
  Chain.ZkSync,
  ZkSyncMessageService
)
