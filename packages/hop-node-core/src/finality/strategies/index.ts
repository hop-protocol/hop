import BonderFinalityStrategies from './bonder/index.js'
import CollateralizedFinalityStrategies from './collateralized/index.js'
import DefaultFinalityStrategies from './default/index.js'
import ThresholdFinalityStrategies from './threshold/index.js'
import { FinalityStrategyType, Strategies } from './IFinalityStrategy.js'

const FinalityStrategies: Record<FinalityStrategyType, Strategies> = {
  [FinalityStrategyType.Bonder]: BonderFinalityStrategies,
  [FinalityStrategyType.Collateralized]: CollateralizedFinalityStrategies,
  [FinalityStrategyType.Default]: DefaultFinalityStrategies,
  [FinalityStrategyType.Threshold]: ThresholdFinalityStrategies
}

export default FinalityStrategies
