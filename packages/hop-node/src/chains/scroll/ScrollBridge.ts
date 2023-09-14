import AbstractBridge from '../AbstractBridge'
import { IChainBridge } from '../IChainBridge'
import { providers } from 'ethers'
import { Chain } from 'src/constants'

class ScrollBridge extends AbstractBridge implements IChainBridge {
  constructor () {
    super(Chain.ScrollZk)
  }

  async relayL2ToL1Message (txHash: string): Promise<providers.TransactionResponse> {
    throw new Error('unimplemented')
  }
}

export default ScrollBridge
