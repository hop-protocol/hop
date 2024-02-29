import { FinalityStrategy } from '../FinalityStrategy.js'
import { IFinalityStrategy } from '../IFinalityStrategy.js'

export class GnosisStrategy extends FinalityStrategy implements IFinalityStrategy {
  getCustomBlockNumber = async (): Promise<number> => {
    const confirmations = 12
    return this.getProbabilisticBlockNumber(confirmations)
  }
}
