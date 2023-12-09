import { Chain } from 'src/constants'
import { PolygonMessageService } from './Message'
import { createChainBridgeClass } from 'src/chains/Factories/ChainBridgeFactory'

export const PolygonBridge = createChainBridgeClass(
  Chain.Polygon,
  PolygonMessageService
)
