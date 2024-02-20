import getChainBridge from 'src/chains/getChainBridge.js'
import { Chain } from 'src/constants/index.js'
import { FinalityBlockTag, IChainBridge } from 'src/chains/IChainBridge.js'
import { FinalityState } from '@hop-protocol/core/config'
import { IFinalityStrategy } from './IFinalityStrategy.js'
import { providers } from 'ethers'

// Default values to be overridden by child classes if desired

export abstract class FinalityStrategy implements IFinalityStrategy {
  protected readonly provider: providers.Provider
  protected readonly chainSlug: Chain

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

  protected async _getCustomBlockNumber (blockTag: FinalityBlockTag): Promise<number | undefined> {
    const chainBridge: IChainBridge = getChainBridge(this.chainSlug)
    if (!chainBridge) {
      throw new Error(`getCustomBlockNumber not implemented for chain ${this.chainSlug}`)
    }

    try {
      const customBlockNumber: number | undefined = await chainBridge.getCustomBlockNumber(blockTag)
      if (customBlockNumber) {
        return customBlockNumber
      }
    } catch {}
  }

  protected getProbabilisticBlockNumber = async (confirmations: number): Promise<number> => {
    const blockNumber: number = await this.getBlockNumber()
    return blockNumber - confirmations
  }
}
