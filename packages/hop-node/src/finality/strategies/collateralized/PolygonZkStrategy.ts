import { FinalityStrategy } from '../FinalityStrategy'
import { IFinalityStrategy } from '../IFinalityStrategy'

export class PolygonZkStrategy extends FinalityStrategy implements IFinalityStrategy {
  override getSafeBlockNumber = async (): Promise<number> => {
    // Somewhat arbitrary, about 25 minutes
    // Approximately 1/2 the time to full finality
    const confirmations = 512
    return this.getProbabilisticBlockNumber(confirmations)
  }

  getCustomBlockNumber = async (): Promise<number> => {
    return this.getSafeBlockNumber()
  }
}
