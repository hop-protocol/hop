import { providers } from 'ethers'
import { Chain } from 'src/constants'
import { IFinalityStrategy } from './strategies/IFinalityStrategy'
import DefaultFinalityStrategy from './strategies/DefaultFinalityStrategy'
import HopFinalityStrategy from './strategies/HopFinalityStrategy'
import CollateralizedFinalityStrategy from './strategies/CollateralizedFinalityStrategy'

const enum FinalityStrategyType {
  Default = 'default',
  Hop = 'hop',
  Collateralized = 'collateralized'
}

// Mapping chain slugs to bridge constructors
const finalityServiceMap: Record<FinalityStrategyType, new (provider: providers.Provider, chainSlug?: string) => IFinalityStrategy> = { 
  [FinalityStrategyType.Default]: DefaultFinalityStrategy,
  [FinalityStrategyType.Hop]: HopFinalityStrategy,
  [FinalityStrategyType.Collateralized]: CollateralizedFinalityStrategy
}

export class FinalityService {
  private readonly provider: providers.Provider
  private readonly chainSlug: Chain
  private readonly strategy: IFinalityStrategy

  constructor (provider: providers.Provider, chainSlug: Chain, finalityStrategyType?: FinalityStrategyType) {
    this.provider = provider
    this.chainSlug = chainSlug
    this.strategy = this._getStrategy(finalityStrategyType)
  }

  private _getStrategy = (finalityStrategyType?: FinalityStrategyType): IFinalityStrategy => {
    if (!finalityStrategyType) {
      return new DefaultFinalityStrategy(this.provider)
    }
    return new finalityServiceMap[finalityStrategyType](this.provider, this.chainSlug)
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
