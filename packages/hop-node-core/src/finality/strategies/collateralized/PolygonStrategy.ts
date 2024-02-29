import { FinalityStrategy } from '../FinalityStrategy.js'
import { IFinalityStrategy } from '../IFinalityStrategy.js'

export class PolygonStrategy extends FinalityStrategy implements IFinalityStrategy {
  override getSafeBlockNumber = async (): Promise<number> => {
    const confirmations = 128
    return this.getProbabilisticBlockNumber(confirmations)
  }

  override getFinalizedBlockNumber = async (): Promise<number> => {
    const confirmations = 256
    return this.getProbabilisticBlockNumber(confirmations)
  }

  getCustomBlockNumber = async (): Promise<number> => {
    const confirmations = 32
    return this.getProbabilisticBlockNumber(confirmations)
  }
}
