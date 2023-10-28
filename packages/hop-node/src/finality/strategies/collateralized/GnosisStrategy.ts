import { FinalityStrategy } from '../FinalityStrategy'
import { IFinalityStrategy } from '../IFinalityStrategy'

export class GnosisStrategy extends FinalityStrategy implements IFinalityStrategy {
  getSyncHeadBlockNumber = async (): Promise<number> => {
    const confirmations = 8
    return this.getProbabilisticBlockNumber(confirmations)
  }
}
