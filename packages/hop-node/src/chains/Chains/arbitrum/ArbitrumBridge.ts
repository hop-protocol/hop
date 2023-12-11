import { ArbitrumInclusionService } from 'src/chains/Chains/arbitrum/Inclusion'
import { ArbitrumMessageService } from 'src/chains/Chains/arbitrum/Message'
import { Chain } from 'src/constants'
import { createChainBridgeClass } from 'src/chains/Factories/ChainBridgeFactory'

export const ArbitrumBridge = createChainBridgeClass(
  Chain.Arbitrum,
  ArbitrumMessageService,
  ArbitrumInclusionService
)
