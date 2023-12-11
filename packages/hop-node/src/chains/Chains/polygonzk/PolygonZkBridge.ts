import { Chain } from 'src/constants'
import { PolygonZkFinalityService } from 'src/chains/Chains/polygonzk/Finality'
import { PolygonZkMessageService } from 'src/chains/Chains/polygonzk/Message'
import { createChainBridgeClass } from 'src/chains/Factories/ChainBridgeFactory'

export const PolygonZkBridge = createChainBridgeClass(
  Chain.PolygonZk,
  PolygonZkMessageService,
  null,
  PolygonZkFinalityService
)
