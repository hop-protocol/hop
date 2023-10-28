import FinalityStrategies from './strategies'
import { Chain } from 'src/constants'
import {
  FinalityStrategyType,
  IFinalityStrategy,
  Strategies,
  Strategy
} from './strategies/IFinalityStrategy'
import { providers } from 'ethers'

export class FinalityService implements IFinalityStrategy {
  private readonly strategy: IFinalityStrategy
  static FinalityStrategyType = FinalityStrategyType

  constructor (
    provider: providers.Provider,
    chainSlug: Chain,
    finalityStrategyType: FinalityStrategyType = FinalityStrategyType.Default
  ) {
    const strategies: Strategies | undefined = FinalityStrategies[finalityStrategyType]
    if (!strategies) {
      throw new Error(`FinalityStrategyType ${finalityStrategyType} is not supported`)
    }

    const strategyConstructor: Strategy | undefined = strategies[chainSlug]
    if (!strategyConstructor) {
      throw new Error(`Finality strategy for ${chainSlug} is not supported`)
    }

    this.strategy = new strategyConstructor(provider, chainSlug)
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
    return this.strategy.getSyncHeadBlockNumber()
  }
}
