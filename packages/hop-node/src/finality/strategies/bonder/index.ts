import { ArbitrumStrategy } from './ArbitrumStrategy'
import { EthereumStrategy } from './EthereumStrategy'
import { GnosisStrategy } from './GnosisStrategy'
import { OptimismStrategy } from './OptimismStrategy'
import { PolygonStrategy } from './PolygonStrategy'

import { Chain } from 'src/constants'
import { Strategies } from '../IFinalityStrategy'

const BonderStrategiesMap: Strategies = {
  [Chain.Ethereum]: EthereumStrategy,
  [Chain.Polygon]: PolygonStrategy,
  [Chain.Gnosis]: GnosisStrategy,
  [Chain.Optimism]: OptimismStrategy,
  [Chain.Base]: OptimismStrategy,
  [Chain.Arbitrum]: ArbitrumStrategy,
  [Chain.Nova]: ArbitrumStrategy
}

export default BonderStrategiesMap
