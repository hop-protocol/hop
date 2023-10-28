import { Chain } from 'src/constants'
import { ChainFinalityStrategy } from '../ChainFinalityStrategy'
import { IFinalityStrategy } from '../IFinalityStrategy'
import { providers } from 'ethers'

export class PolygonFinalityStrategy extends ChainFinalityStrategy implements IFinalityStrategy {
  constructor (provider: providers.Provider) {
    super(provider, Chain.Polygon)
  }

  getSafeBlockNumber = async (): Promise<number> => {
    const confirmations = 128
    return this.getProbabilisticBlockNumber(confirmations)
  }

  getFinalizedBlockNumber = async (): Promise<number> => {
    const confirmations = 256
    return this.getProbabilisticBlockNumber(confirmations)
  }
}
