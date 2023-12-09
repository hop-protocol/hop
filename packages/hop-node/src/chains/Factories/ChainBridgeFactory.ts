import { AbstractChainBridge } from 'src/chains/AbstractChainBridge'
import { Chain } from 'src/constants'
import { FinalityService, IChainBridge, InclusionService, MessageService } from 'src/chains/IChainBridge'

export function createChainBridgeClass (chainSlug: Chain, Message?: MessageService | null, Inclusion?: InclusionService | null, Finality?: FinalityService | null): new() => IChainBridge {
  return class ChainBridge extends AbstractChainBridge implements IChainBridge {
    chainSlug = chainSlug
    message = Message ? new Message() : undefined
    inclusion = Inclusion ? new Inclusion() : undefined
    finality = Finality ? new Finality(this.inclusion) : undefined
  }
}
