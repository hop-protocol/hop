import { Chain } from 'src/constants'
import { ChainBridgeParams } from 'src/chains/AbstractChainBridge'
import { OptimismFinalityService } from 'src/chains/Chains/optimism/OptimismFinalityService'
import { OptimismInclusionService } from 'src/chains/Chains/optimism/OptimismInclusionService'
import { OptimismMessageService } from 'src/chains/Chains/optimism/OptimismMessageService'

export const OptimismBridgeParams: ChainBridgeParams = {
  chainSlug: Chain.Optimism,
  Message: OptimismMessageService,
  Inclusion: OptimismInclusionService,
  Finality: OptimismFinalityService
}
