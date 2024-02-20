import { FinalityStrategy } from '../FinalityStrategy.js'
import { IFinalityStrategy } from '../IFinalityStrategy.js'

export class ArbitrumStrategy extends FinalityStrategy implements IFinalityStrategy {
  getCustomBlockNumber = async (): Promise<number> => {
    return this.getBlockNumber()
  }
}
