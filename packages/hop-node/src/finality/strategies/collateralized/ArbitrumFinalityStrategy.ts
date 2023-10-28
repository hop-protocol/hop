import { Chain } from 'src/constants'
import { ChainFinalityStrategy } from '../ChainFinalityStrategy'
import { IFinalityStrategy } from '../IFinalityStrategy'
import { providers } from 'ethers'

export class ArbitrumFinalityStrategy extends ChainFinalityStrategy implements IFinalityStrategy {
  constructor (provider: providers.Provider) {
    super(provider, Chain.Arbitrum)
  }

  getSyncHeadBlockNumber = async (): Promise<number> => {
    return this.getBlockNumber()
  }
}
