import { ArbitrumFinalityStrategy } from './ArbitrumFinalityStrategy'
import { EthereumFinalityStrategy } from './EthereumFinalityStrategy'
import { GnosisFinalityStrategy } from './GnosisFinalityStrategy'
import { OptimismFinalityStrategy } from './OptimismFinalityStrategy'
import { PolygonFinalityStrategy } from './PolygonFinalityStrategy'

import { Chain } from 'src/constants'
import { ChainFinalityStrategy } from '../IFinalityStrategy'

const DefaultStrategiesMap: ChainFinalityStrategy = {
  [Chain.Ethereum]: EthereumFinalityStrategy,
  [Chain.Polygon]: PolygonFinalityStrategy,
  [Chain.Gnosis]: GnosisFinalityStrategy,
  [Chain.Optimism]: OptimismFinalityStrategy,
  [Chain.Base]: OptimismFinalityStrategy,
  [Chain.Arbitrum]: ArbitrumFinalityStrategy,
  [Chain.Nova]: ArbitrumFinalityStrategy
}

export default DefaultStrategiesMap
