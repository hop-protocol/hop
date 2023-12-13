import { Chain } from 'src/constants'
import { ChainBridgeParams } from 'src/chains/ChainBridge'
import { OptimismFinalityService } from 'src/chains/Chains/optimism/OptimismFinalityService'
import { OptimismInclusionService } from 'src/chains/Chains/optimism/OptimismInclusionService'
import { OptimismMessageService } from 'src/chains/Chains/optimism/OptimismMessageService'

export const OptimismBridgeParams: ChainBridgeParams = {
  chainSlug: Chain.Optimism,
  chainServices: {
    MessageService: OptimismMessageService,
    InclusionService: OptimismInclusionService,
    FinalityService: OptimismFinalityService
  }
}
