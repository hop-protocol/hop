import { AbstractChainBridge } from '../../AbstractChainBridge'
import { Chain } from 'src/constants'
import { GnosisMessageService } from './Message'
import { IChainBridge } from '../../IChainBridge'

export class GnosisBridge extends AbstractChainBridge implements IChainBridge {
  chainSlug = Chain.Gnosis
  message = new GnosisMessageService()
}
