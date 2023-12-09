import { ArbitrumInclusionService } from './Inclusion'
import { ArbitrumMessageService } from './Message'
import { Chain } from 'src/constants'
import { createChainBridgeClass } from 'src/chains/Factories/ChainBridgeFactory'

export const ArbitrumBridge = createChainBridgeClass(
  Chain.Arbitrum,
  ArbitrumMessageService,
  ArbitrumInclusionService
)
