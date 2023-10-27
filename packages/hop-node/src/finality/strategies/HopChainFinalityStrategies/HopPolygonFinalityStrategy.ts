import { providers } from 'ethers'
import { IFinalityStrategy } from '../IFinalityStrategy'
import { Chain } from 'src/constants'
import { HopChainFinalityStrategy } from './HopChainFinalityStrategy'

export class HopPolygonFinalityStrategy extends HopChainFinalityStrategy implements IFinalityStrategy {
  constructor (provider: providers.Provider) {
    super(provider, Chain.Polygon)
  }

  getBlockNumber = async (): Promise<number> => {
    return this.provider.getBlockNumber()
  }

  getSafeBlockNumber = async (): Promise<number> => {
    const blockNumber: number = await this.provider.getBlockNumber()
    const safeConfirmations = 128
    return blockNumber - safeConfirmations
  }

  getFinalizedBlockNumber = async (): Promise<number> => {
    const blockNumber: number = await this.provider.getBlockNumber()
    const finalizedConfirmations = 256
    return blockNumber - finalizedConfirmations
  }

  getSyncHeadBlockNumber = async (): Promise<number> => {
    const blockNumber: number = await this.provider.getBlockNumber()
    const syncHeadConfirmations = 64
    return blockNumber - syncHeadConfirmations
  }
}
