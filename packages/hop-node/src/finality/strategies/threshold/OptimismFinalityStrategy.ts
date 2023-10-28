import { Chain } from 'src/constants'
import { ChainFinalityStrategy } from '../ChainFinalityStrategy'
import { IFinalityStrategy } from '../IFinalityStrategy'
import { getCustomOptimismSafeBlockNumber } from '../utils'
import { providers } from 'ethers'

export class OptimismFinalityStrategy extends ChainFinalityStrategy implements IFinalityStrategy {
  constructor (provider: providers.Provider) {
    super(provider, Chain.Optimism)
  }

  getSafeBlockNumber = async (): Promise<number> => {
    const blockNumber = await getCustomOptimismSafeBlockNumber(this.chainSlug)
    if (blockNumber) {
      return blockNumber
    }

    // Optimism's safe can be reorged, so we must use finalized block number as the safe block number if
    // the custom implementation is not available.
    return this.getFinalizedBlockNumber()
  }

  getSyncHeadBlockNumber = async (): Promise<number> => {
    return this.getBlockNumber()
  }
}
