import { Chain } from 'src/constants'
import { IFinalityStrategy } from './IFinalityStrategy'
import { providers } from 'ethers'

import { HopArbitrumFinalityStrategy } from './HopChainFinalityStrategies/HopArbitrumFinalityStrategy'
import { HopEthereumFinalityStrategy } from './HopChainFinalityStrategies/HopEthereumFinalityStrategy'
import { HopGnosisFinalityStrategy } from './HopChainFinalityStrategies/HopGnosisFinalityStrategy'
import { HopOptimismFinalityStrategy } from './HopChainFinalityStrategies/HopOptimismFinalityStrategy'
import { HopPolygonFinalityStrategy } from './HopChainFinalityStrategies/HopPolygonFinalityStrategy'

const hopChainFinalityStrategyMap: Record<string, new (provider: providers.Provider) => IFinalityStrategy> = {
  [Chain.Ethereum]: HopEthereumFinalityStrategy,
  [Chain.Polygon]: HopPolygonFinalityStrategy,
  [Chain.Gnosis]: HopGnosisFinalityStrategy,
  [Chain.Optimism]: HopOptimismFinalityStrategy,
  [Chain.Base]: HopOptimismFinalityStrategy,
  [Chain.Arbitrum]: HopArbitrumFinalityStrategy,
  [Chain.Nova]: HopArbitrumFinalityStrategy
}

export default class HopFinalityStrategy implements IFinalityStrategy {
  private readonly provider: providers.Provider
  private readonly strategy: IFinalityStrategy

  constructor (provider: providers.Provider, chainSlug: Chain) {
    this.provider = provider
    this.strategy = this.getStrategy(chainSlug)
  }

  private readonly getStrategy = (chainSlug: Chain): IFinalityStrategy => {
    const strategyConstructor = hopChainFinalityStrategyMap[chainSlug]
    if (!strategyConstructor) {
      throw new Error(`hopChainFinalityStrategyMap for chainSlug ${chainSlug} is not supported`)
    }
    return new strategyConstructor(this.provider)
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
