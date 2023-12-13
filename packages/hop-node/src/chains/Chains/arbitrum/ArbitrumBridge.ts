import { ArbitrumInclusionService } from 'src/chains/Chains/arbitrum/ArbitrumInclusionService'
import { ArbitrumMessageService } from 'src/chains/Chains/arbitrum/ArbitrumMessageService'
import { Chain } from 'src/constants'
import { ChainBridgeParams } from 'src/chains/ChainBridge'

export const ArbitrumBridgeParams: ChainBridgeParams = {
  chainSlug: Chain.Arbitrum,
  Message: ArbitrumMessageService,
  Inclusion: ArbitrumInclusionService
}
