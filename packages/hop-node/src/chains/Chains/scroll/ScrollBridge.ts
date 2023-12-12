import { Chain } from 'src/constants'
import { ScrollMessageService } from 'src/chains/Chains/scroll/ScrollMessageService'
import { createChainBridgeClass } from 'src/chains/Factories/ChainBridgeFactory'

export const ScrollZkBridge = createChainBridgeClass(
  Chain.ScrollZk,
  ScrollMessageService
)
