import { Chain } from 'src/constants'
import { ScrollMessageService } from 'src/chains/Chains/scroll/Message'
import { createChainBridgeClass } from 'src/chains/Factories/ChainBridgeFactory'

export const ScrollZkBridge = createChainBridgeClass(
  Chain.ScrollZk,
  ScrollMessageService
)
