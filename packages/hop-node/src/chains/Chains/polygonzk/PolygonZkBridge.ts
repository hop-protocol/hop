import { Chain } from 'src/constants'
import { PolygonZkFinalityService } from 'src/chains/Chains/polygonzk/PolygonZkFinalityService'
import { PolygonZkMessageService } from 'src/chains/Chains/polygonzk/PolygonZkMessageService'
import { createChainBridgeClass } from 'src/chains/Factories/ChainBridgeFactory'

export const PolygonZkBridge = createChainBridgeClass(
  Chain.PolygonZk,
  PolygonZkMessageService,
  null,
  PolygonZkFinalityService
)
