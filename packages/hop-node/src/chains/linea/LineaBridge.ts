import AbstractBridge from '../AbstractBridge'
import { IChainBridge } from '.././IChainBridge'
import { providers } from 'ethers'

class LineaBridge extends AbstractBridge implements IChainBridge {
  async relayL2ToL1Message (txHash: string): Promise<providers.TransactionResponse> {
    throw new Error('unimplemented')
  }
}

export default LineaBridge
