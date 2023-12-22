import FinalityStrategies from './strategies'
import { Chain } from 'src/constants'
import {
  FinalityStrategyType,
  IFinalityStrategy,
  Strategies,
  Strategy
} from './strategies/IFinalityStrategy'
import { IFinalityService } from './IFinalityService'
import { providers } from 'ethers'

export class FinalityService implements IFinalityService {
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

    const StrategyConstructor: Strategy | undefined = strategies[chainSlug]
    if (!StrategyConstructor) {
      throw new Error(`Finality strategy for ${chainSlug} is not supported`)
    }

    this.strategy = new StrategyConstructor(provider, chainSlug)
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

  getCustomBlockNumber = async (): Promise<number> => {
    if (!this.isCustomBlockNumberImplemented()) {
      throw new Error('Custom block number is not supported')
    }
    return this.strategy.getCustomBlockNumber!()
  }

  isCustomBlockNumberImplemented = (): boolean => {
    return !!this.strategy.getCustomBlockNumber
  }
}
