import { Chain } from 'src/constants'
import { PolygonMessageService } from 'src/chains/Chains/polygon/PolygonMessageService'
import { createChainBridgeClass } from 'src/chains/Factories/ChainBridgeFactory'

export const PolygonBridge = createChainBridgeClass(
  Chain.Polygon,
  PolygonMessageService
)
