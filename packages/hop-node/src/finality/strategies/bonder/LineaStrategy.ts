import { FinalityStrategy } from '../FinalityStrategy'
import { IFinalityStrategy } from '../IFinalityStrategy'

export class LineaStrategy extends FinalityStrategy implements IFinalityStrategy {
  getSafeBlockNumber = async (): Promise<number> => {
    const confirmations = 75
    return this.getProbabilisticBlockNumber(confirmations)
  }

  getFinalizedBlockNumber = async (): Promise<number> => {
    const confirmations = 100
    return this.getProbabilisticBlockNumber(confirmations)
  }
}
