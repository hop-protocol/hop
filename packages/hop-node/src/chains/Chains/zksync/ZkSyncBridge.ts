import { Chain } from 'src/constants'
import { ZkSyncMessageService } from './Message'
import { createChainBridgeClass } from 'src/chains/Factories/ChainBridgeFactory'

export const ZkSyncBridge = createChainBridgeClass(
  Chain.ZkSync,
  ZkSyncMessageService
)
