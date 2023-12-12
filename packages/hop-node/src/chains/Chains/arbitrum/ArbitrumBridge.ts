import { ArbitrumInclusionService } from 'src/chains/Chains/arbitrum/ArbitrumInclusionService'
import { ArbitrumMessageService } from 'src/chains/Chains/arbitrum/ArbitrumMessageService'
import { Chain } from 'src/constants'
import { createChainBridgeClass } from 'src/chains/Factories/ChainBridgeFactory'

export const ArbitrumBridge = createChainBridgeClass(
  Chain.Arbitrum,
  ArbitrumMessageService,
  ArbitrumInclusionService
)
