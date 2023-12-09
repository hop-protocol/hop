import { Chain } from 'src/constants'
import { PolygonZkFinalityService } from './Finality'
import { PolygonZkMessageService } from './Message'
import { createChainBridgeClass } from 'src/chains/Factories/ChainBridgeFactory'

export const PolygonZkBridge = createChainBridgeClass(
  Chain.PolygonZk,
  PolygonZkMessageService,
  null,
  PolygonZkFinalityService
)
