import AbstractBridge from '../AbstractBridge'
import { Chain } from 'src/constants'
import { IChainBridge } from '../IChainBridge'
import { providers } from 'ethers'

class ScrollBridge extends AbstractBridge implements IChainBridge {
  constructor () {
    super(Chain.ScrollZk)
  }

  async relayL2ToL1Message (txHash: string): Promise<providers.TransactionResponse> {
    throw new Error('unimplemented')
  }
}

export default ScrollBridge
