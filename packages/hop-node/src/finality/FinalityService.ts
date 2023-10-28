import { Chain } from 'src/constants'
import { ChainFinalityStrategy, IFinalityStrategy, Strategy } from './strategies/IFinalityStrategy'
import { providers } from 'ethers'

import BonderChainStrategies from './strategies/bonder'
import CollateralizedChainStrategies from './strategies/collateralized'
import DefaultChainStrategies from './strategies/default'
import ThresholdChainStrategies from './strategies/threshold'

export enum FinalityStrategyType {
  Bonder = 'bonder',
  Collateralized = 'collateralized',
  Default = 'default',
  Threshold = 'threshold'
}

export class FinalityService implements IFinalityStrategy {
  private readonly strategy: IFinalityStrategy
  // TODO: Custom type??
  private static readonly strategyTypeMap: Record<FinalityStrategyType, ChainFinalityStrategy> = {
    [FinalityStrategyType.Bonder]: BonderChainStrategies,
    [FinalityStrategyType.Collateralized]: CollateralizedChainStrategies,
    [FinalityStrategyType.Default]: DefaultChainStrategies,
    [FinalityStrategyType.Threshold]: ThresholdChainStrategies
  }

  constructor (provider: providers.Provider, chainSlug: Chain, finalityStrategyType: FinalityStrategyType = FinalityStrategyType.Default) {
    const strategies: ChainFinalityStrategy | undefined = FinalityService.strategyTypeMap[finalityStrategyType]
    if (!strategies) {
      throw new Error(`FinalityStrategyType ${finalityStrategyType} is not supported`)
    }

    const strategyConstructor: Strategy | undefined = strategies[chainSlug]
    if (!strategyConstructor) {
      throw new Error(`Chain strategy for ${chainSlug} is not supported`)
    }

    this.strategy = new strategyConstructor(provider)
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
