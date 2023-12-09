import { AbstractChainBridge } from '../../AbstractChainBridge'
import { Chain } from 'src/constants'
import { IChainBridge } from '../../IChainBridge'
import { LineaMessageService } from './Message'

export class LineaBridge extends AbstractChainBridge implements IChainBridge {
  chainSlug = Chain.Linea
  message = new LineaMessageService()
}
