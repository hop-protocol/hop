import { AbstractChainBridge } from '../../AbstractChainBridge'
import { Chain } from 'src/constants'
import { IChainBridge } from '../../IChainBridge'
import { PolygonMessageService } from './Message'

export class PolygonBridge extends AbstractChainBridge implements IChainBridge {
  chainSlug = Chain.Polygon
  message = new PolygonMessageService()
}
