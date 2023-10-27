import { providers } from 'ethers'
import { FinalityState } from '@hop-protocol/core/config'
import { IFinalityStrategy } from './IFinalityStrategy'
import { Chain } from 'src/constants'
import getChainBridge from 'src/chains/getChainBridge'

export default class HopFinalityStrategy implements IFinalityStrategy {
  private readonly provider: providers.Provider
  private readonly strategy: IFinalityStrategy

  constructor (provider: providers.Provider, chainSlug: Chain) {
    this.provider = provider
    this.strategy = this._getStrategy(chainSlug)
  }

  private _getStrategy = (chainSlug: Chain): IFinalityStrategy => {
    if (chainSlug === Chain.Optimism) {
      return new HopOptimismFinalityStrategy(this.provider)
    } else {
      throw new Error(`unknown finality strategy type ${chainSlug}`)
    }
  }

  getBlockNumber = async (): Promise<number> => {
    return this.strategy.getBlockNumber()
  }

  getSafeBlockNumber = async (): Promise<number> => {
    return this.strategy.getSafeBlockNumber()
  }

  getFinalizedBlockNumber = async (): Promise<number> => {
    return this.strategy.getFinalizedBlockNumber()
  }
}

class HopOptimismFinalityStrategy implements IFinalityStrategy {
  private readonly provider: providers.Provider
  private readonly chainSlug: Chain

  constructor (provider: providers.Provider) {
    this.provider = provider
    this.chainSlug = Chain.Optimism
  }

  getBlockNumber = async (): Promise<number> => {
    return this.provider.getBlockNumber()
  }

  getSafeBlockNumber = async (): Promise<number> => {
    return this._getSafeBlockNumber()
  }

  getFinalizedBlockNumber = async (): Promise<number> => {
    const block = await this.provider.getBlock(FinalityState.Finalized)
    return Number(block.number)
  }

  private _getSafeBlockNumber = async (): Promise<number> => {
    const chainBridge = getChainBridge(this.chainSlug)
    if (!chainBridge?.getCustomSafeBlockNumber) {
      throw new Error(`getCustomFinalityBlockNumber not implemented for chain ${this.chainSlug}`)
    }

    try {
      const customSafeBlockNumber: number | undefined = await chainBridge.getCustomSafeBlockNumber()
      if (customSafeBlockNumber) {
        return customSafeBlockNumber
      }
    } catch {}

    const defaultSafeBlock = await this.provider.getBlock(FinalityState.Safe)
    return Number(defaultSafeBlock.number)
  }
}