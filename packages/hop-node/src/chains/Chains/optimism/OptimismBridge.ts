import { Chain } from 'src/constants'
import { OptimismFinalityService } from './Finality'
import { OptimismInclusionService } from './Inclusion'
import { OptimismMessageService } from './Message'
import { createChainBridgeClass } from 'src/chains/Factories/ChainBridgeFactory'

export const OptimismBridge = createChainBridgeClass(
  Chain.Optimism,
  OptimismMessageService,
  OptimismInclusionService,
  OptimismFinalityService
)
