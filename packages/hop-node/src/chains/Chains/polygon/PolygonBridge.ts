import { Chain } from 'src/constants'
import { ChainBridgeParams } from 'src/chains/ChainBridge'
import { PolygonMessageService } from 'src/chains/Chains/polygon/PolygonMessageService'

export const PolygonBridgeParams: ChainBridgeParams = {
  chainSlug: Chain.Polygon,
  chainServices: {
    MessageService: PolygonMessageService
  }
}
