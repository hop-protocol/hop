import AbstractChainBridge from '../AbstractChainBridge'
import { IChainBridge } from '.././IChainBridge'
import { providers } from 'ethers'

class LineaBridge extends AbstractChainBridge implements IChainBridge {
  async relayL2ToL1Message (txHash: string): Promise<providers.TransactionResponse> {
    throw new Error('unimplemented')
  }
}

export default LineaBridge
