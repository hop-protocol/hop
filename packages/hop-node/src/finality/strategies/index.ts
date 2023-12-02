import BonderFinalityStrategies from './bonder'
import CollateralizedFinalityStrategies from './collateralized'
import DefaultFinalityStrategies from './default'
import ThresholdFinalityStrategies from './threshold'
import { FinalityStrategyType, Strategies } from './IFinalityStrategy'

const FinalityStrategies: Record<FinalityStrategyType, Strategies> = {
  [FinalityStrategyType.Bonder]: BonderFinalityStrategies,
  [FinalityStrategyType.Collateralized]: CollateralizedFinalityStrategies,
  [FinalityStrategyType.Default]: DefaultFinalityStrategies,
  [FinalityStrategyType.Threshold]: ThresholdFinalityStrategies
}

export default FinalityStrategies
