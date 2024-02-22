import { ArbitrumStrategy } from './ArbitrumStrategy.js'
import { EthereumStrategy } from './EthereumStrategy.js'
import { GnosisStrategy } from './GnosisStrategy.js'
import { LineaStrategy } from './LineaStrategy.js'
import { OptimismStrategy } from './OptimismStrategy.js'
import { PolygonStrategy } from './PolygonStrategy.js'
import { PolygonZkStrategy } from './PolygonZkStrategy.js'

import { Chain } from '#constants/index.js'
import { Strategies } from '../IFinalityStrategy.js'

export const BonderStrategiesMap: Strategies = {
  [Chain.Ethereum]: EthereumStrategy,
  [Chain.Polygon]: PolygonStrategy,
  [Chain.Gnosis]: GnosisStrategy,
  [Chain.Optimism]: OptimismStrategy,
  [Chain.Base]: OptimismStrategy,
  [Chain.Arbitrum]: ArbitrumStrategy,
  [Chain.Nova]: ArbitrumStrategy,
  [Chain.Linea]: LineaStrategy,
  [Chain.PolygonZk]: PolygonZkStrategy
}
