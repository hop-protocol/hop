import { AbstractChainBridge } from '../../AbstractChainBridge'
import { Chain } from 'src/constants'
import { IChainBridge } from '../../IChainBridge'
import { PolygonZkFinalityService } from './Finality'
import { PolygonZkMessageService } from './Message'

export class PolygonZkBridge extends AbstractChainBridge implements IChainBridge {
  chainSlug = Chain.Polygon
  message = new PolygonZkMessageService()
  finality = new PolygonZkFinalityService()
}
