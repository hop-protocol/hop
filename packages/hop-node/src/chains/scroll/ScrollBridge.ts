import AbstractBridge from '../AbstractBridge'
import { IChainBridge } from '../IChainBridge'
import { providers } from 'ethers'

class ScrollBridge extends AbstractBridge implements IChainBridge {
  constructor (chainSlug: string) {
    super(chainSlug)
  }

  async relayL2ToL1Message (txHash: string): Promise<providers.TransactionResponse> {
    throw new Error('unimplemented')
  }
}

export default ScrollBridge
