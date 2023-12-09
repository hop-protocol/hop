import { AbstractChainBridge } from '../../AbstractChainBridge'
import { Chain } from 'src/constants'
import { IChainBridge } from '../../IChainBridge'
import { OptimismFinalityService } from './Finality'
import { OptimismInclusionService } from './Inclusion'
import { OptimismMessageService } from './Message'

export class OptimismBridge extends AbstractChainBridge implements IChainBridge {
  chainSlug = Chain.Optimism
  message = new OptimismMessageService()
  inclusion = new OptimismInclusionService()
  finality = new OptimismFinalityService(this.inclusion)
}
