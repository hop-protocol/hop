import { FinalityStrategy } from '../FinalityStrategy'
import { IFinalityStrategy } from '../IFinalityStrategy'

export class PolygonStrategy extends FinalityStrategy implements IFinalityStrategy {
  getSafeBlockNumber = async (): Promise<number> => {
    const confirmations = 128
    return this.getProbabilisticBlockNumber(confirmations)
  }

  getFinalizedBlockNumber = async (): Promise<number> => {
    const confirmations = 256
    return this.getProbabilisticBlockNumber(confirmations)
  }

  getCustomBlockNumber = async (): Promise<number> => {
    const confirmations = 64
    return this.getProbabilisticBlockNumber(confirmations)
  }
}
