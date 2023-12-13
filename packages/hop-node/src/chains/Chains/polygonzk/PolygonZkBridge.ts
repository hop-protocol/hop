import { Chain } from 'src/constants'
import { ChainBridgeParams } from 'src/chains/ChainBridge'
import { PolygonZkFinalityService } from 'src/chains/Chains/polygonzk/PolygonZkFinalityService'
import { PolygonZkMessageService } from 'src/chains/Chains/polygonzk/PolygonZkMessageService'

export const PolygonZkBridgeParams: ChainBridgeParams = {
  chainSlug: Chain.PolygonZk,
  Message: PolygonZkMessageService,
  Finality: PolygonZkFinalityService
}
