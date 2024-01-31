import { FinalityBlockTag } from 'src/chains/IChainBridge'
import { FinalityStrategy } from '../FinalityStrategy'
import { IFinalityStrategy } from '../IFinalityStrategy'

export class OptimismStrategy extends FinalityStrategy implements IFinalityStrategy {
  override getSafeBlockNumber = async (): Promise<number> => {
    const blockNumber = await this._getCustomBlockNumber(FinalityBlockTag.Safe)
    if (blockNumber) {
      return blockNumber
    }

    // Optimism's safe can be reorged, so we must use finalized block number as the safe block number if
    // the custom implementation is not available.
    return this.getFinalizedBlockNumber()
  }

  getCustomBlockNumber = async (): Promise<number> => {
    return this.getBlockNumber()
  }
}
