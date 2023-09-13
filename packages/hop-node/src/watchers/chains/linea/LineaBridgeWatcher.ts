import AbstractChainWatcher from '../AbstractChainWatcher'
import { IChainWatcher } from '../../classes/IChainWatcher'
import { providers } from 'ethers'
import { Chain } from 'src/constants'

class LineaBridgeWatcher extends AbstractChainWatcher implements IChainWatcher {
  constructor () {
    super(Chain.Linea)
  }

  async relayL2ToL1Message (txHash: string): Promise<providers.TransactionResponse> {
    throw new Error('unimplemented')
  }
}

export default LineaBridgeWatcher
