import { Chain } from 'src/constants'
import { ChainBridgeParams } from 'src/chains/AbstractChainBridge'
import { PolygonMessageService } from 'src/chains/Chains/polygon/PolygonMessageService'

export const PolygonBridgeParams: ChainBridgeParams = {
  chainSlug: Chain.Polygon,
  Message: PolygonMessageService
}
