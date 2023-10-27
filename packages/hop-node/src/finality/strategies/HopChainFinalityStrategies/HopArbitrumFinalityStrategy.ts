import { providers } from 'ethers'
import { FinalityState } from '@hop-protocol/core/config'
import { IFinalityStrategy } from '../IFinalityStrategy'
import { Chain } from 'src/constants'
import { HopChainFinalityStrategy } from './HopChainFinalityStrategy'

export class HopArbitrumFinalityStrategy extends HopChainFinalityStrategy implements IFinalityStrategy {
  constructor (provider: providers.Provider) {
    super(provider, Chain.Arbitrum)
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
    return this.getSafeBlockNumber()
  }
}
