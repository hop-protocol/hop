import { Chain } from 'src/constants'
import { FinalityState } from '@hop-protocol/core/config'
import { providers } from 'ethers'

// Default values to be overridden by child classes if desired

export abstract class ChainFinalityStrategy {
  readonly provider: providers.Provider
  readonly chainSlug: Chain

  constructor (provider: providers.Provider, chainSlug: Chain) {
    this.provider = provider
    this.chainSlug = chainSlug
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
    return this.getFinalizedBlockNumber()
  }

  getProbabilisticBlockNumber = async (confirmations: number): Promise<number> => {
    const blockNumber: number = await this.getBlockNumber()
    return blockNumber - confirmations
  }
}
