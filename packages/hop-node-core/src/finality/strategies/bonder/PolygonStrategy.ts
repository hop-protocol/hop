import { FinalityStrategy } from '../FinalityStrategy'
import { IFinalityStrategy } from '../IFinalityStrategy'

export class PolygonStrategy extends FinalityStrategy implements IFinalityStrategy {
  override getSafeBlockNumber = async (): Promise<number> => {
    const confirmations = 128
    return this.getProbabilisticBlockNumber(confirmations)
  }

  override getFinalizedBlockNumber = async (): Promise<number> => {
    const confirmations = 256
    return this.getProbabilisticBlockNumber(confirmations)
  }
}
