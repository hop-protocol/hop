import { Chain } from 'src/constants'
import { OptimismFinalityService } from 'src/chains/Chains/optimism/Finality'
import { OptimismInclusionService } from 'src/chains/Chains/optimism/Inclusion'
import { OptimismMessageService } from 'src/chains/Chains/optimism/Message'
import { createChainBridgeClass } from 'src/chains/Factories/ChainBridgeFactory'

export const OptimismBridge = createChainBridgeClass(
  Chain.Optimism,
  OptimismMessageService,
  OptimismInclusionService,
  OptimismFinalityService
)
