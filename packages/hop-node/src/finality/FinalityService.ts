import { Chain } from 'src/constants'
import { IFinalityStrategy, Strategies, Strategy } from './strategies/IFinalityStrategy'
import { providers } from 'ethers'

import BonderFinalityStrategies from './strategies/bonder'
import CollateralizedFinalityStrategies from './strategies/collateralized'
import DefaultFinalityStrategies from './strategies/default'
import ThresholdFinalityStrategies from './strategies/threshold'

export enum FinalityStrategyType {
  Bonder = 'bonder',
  Collateralized = 'collateralized',
  Default = 'default',
  Threshold = 'threshold'
}

export class FinalityService implements IFinalityStrategy {
  private readonly strategy: IFinalityStrategy
  private static readonly strategyTypeMap: Record<FinalityStrategyType, Strategies> = {
    [FinalityStrategyType.Bonder]: BonderFinalityStrategies,
    [FinalityStrategyType.Collateralized]: CollateralizedFinalityStrategies,
    [FinalityStrategyType.Default]: DefaultFinalityStrategies,
    [FinalityStrategyType.Threshold]: ThresholdFinalityStrategies
  }

  constructor (
    provider: providers.Provider,
    chainSlug: Chain,
    finalityStrategyType: FinalityStrategyType = FinalityStrategyType.Default
  ) {
    const strategies: Strategies | undefined = FinalityService.strategyTypeMap[finalityStrategyType]
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
