import { providers } from 'ethers'
import { Chain } from 'src/constants'
import { IFinalityStrategy } from './strategies/IFinalityStrategy'
import DefaultFinalityStrategy from './strategies/DefaultFinalityStrategy'
import HopFinalityStrategy from './strategies/HopFinalityStrategy'
import CollateralizedFinalityStrategy from './strategies/CollateralizedFinalityStrategy'

// TODO: Generalize this outside of this class after adding more strategies. This service should
// accept the entire strategy from the consumer, not just tye type.
enum FinalityStrategyType {
  Default = 'default',
  Hop = 'hop',
  Collateralized = 'collateralized'
}

const finalityServiceMap: Record<FinalityStrategyType, new (provider: providers.Provider, chainSlug?: string) => IFinalityStrategy> = { 
  [FinalityStrategyType.Default]: DefaultFinalityStrategy,
  [FinalityStrategyType.Hop]: HopFinalityStrategy,
  [FinalityStrategyType.Collateralized]: CollateralizedFinalityStrategy
}

export class FinalityService implements IFinalityStrategy {
  private readonly provider: providers.Provider
  private readonly chainSlug: Chain
  private readonly strategy: IFinalityStrategy

  constructor (provider: providers.Provider, chainSlug: Chain, finalityStrategyType: FinalityStrategyType = FinalityStrategyType.Default) {
    this.provider = provider
    this.chainSlug = chainSlug
    this.strategy = this.getStrategy(finalityStrategyType)
  }

  private getStrategy = (finalityStrategyType: FinalityStrategyType): IFinalityStrategy => {
    const strategyConstructor = finalityServiceMap[finalityStrategyType]
    if (!strategyConstructor) {
      throw new Error(`FinalityStrategyType ${finalityStrategyType} is not supported`)
    }
    return new strategyConstructor(this.provider, this.chainSlug)
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

  getSyncHeadBlockNumber = async (): Promise<number> => {
    return this.strategy.getFinalizedBlockNumber()
  }
}
