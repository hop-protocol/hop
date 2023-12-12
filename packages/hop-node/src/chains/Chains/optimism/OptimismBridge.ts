import { Chain } from 'src/constants'
import { OptimismFinalityService } from 'src/chains/Chains/optimism/OptimismFinalityService'
import { OptimismInclusionService } from 'src/chains/Chains/optimism/OptimismInclusionService'
import { OptimismMessageService } from 'src/chains/Chains/optimism/OptimismMessageService'
import { createChainBridgeClass } from 'src/chains/Factories/ChainBridgeFactory'

export const OptimismBridge = createChainBridgeClass(
  Chain.Optimism,
  OptimismMessageService,
  OptimismInclusionService,
  OptimismFinalityService
)
