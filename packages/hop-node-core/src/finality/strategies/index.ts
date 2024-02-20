import { BonderStrategiesMap } from './bonder/index.js'
import { CollateralizedStrategiesMap } from './collateralized/index.js'
import { DefaultStrategiesMap } from './default/index.js'
import { ThresholdStrategiesMap } from './threshold/index.js'
import { FinalityStrategyType, Strategies } from './IFinalityStrategy.js'

export const FinalityStrategies: Record<FinalityStrategyType, Strategies> = {
  [FinalityStrategyType.Bonder]: BonderStrategiesMap,
  [FinalityStrategyType.Collateralized]: CollateralizedStrategiesMap,
  [FinalityStrategyType.Default]: DefaultStrategiesMap,
  [FinalityStrategyType.Threshold]: ThresholdStrategiesMap
}
