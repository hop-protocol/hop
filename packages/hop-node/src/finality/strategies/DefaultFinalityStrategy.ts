import { providers } from 'ethers'
import { FinalityState } from '@hop-protocol/core/config'
import { IFinalityStrategy } from './IFinalityStrategy'

export default class DefaultFinalityStrategy implements IFinalityStrategy {
  private readonly provider: providers.Provider

  constructor (provider: providers.Provider) {
    this.provider = provider
  }

  getBlockNumber = async (): Promise<number> => {
    return this.provider.getBlockNumber()
  }

  getSafeBlockNumber = async (): Promise<number> => {
    const block = await this.provider.getBlock(FinalityState.Safe)
    return Number(block.number)
  }

  getFinalizedBlockNumber = async (): Promise<number> => {
    const block = await this.provider.getBlock(FinalityState.Finalized)
    return Number(block.number)
  }

  getSyncHeadBlockNumber = async (): Promise<number> => {
    return this.getBlockNumber()
  }
}
