import { FinalityStrategy } from '../FinalityStrategy'
import { IFinalityStrategy } from '../IFinalityStrategy'

export class PolygonZkStrategy extends FinalityStrategy implements IFinalityStrategy {
  getCustomBlockNumber = async (): Promise<number> => {
    return this.getBlockNumber()
  }
}
