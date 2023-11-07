import { ArbitrumStrategy } from './ArbitrumStrategy'
import { EthereumStrategy } from './EthereumStrategy'
import { GnosisStrategy } from './GnosisStrategy'
import { LineaStrategy } from './LineaStrategy'
import { OptimismStrategy } from './OptimismStrategy'
import { PolygonStrategy } from './PolygonStrategy'

import { Chain } from 'src/constants'
import { Strategies } from '../IFinalityStrategy'

const DefaultStrategiesMap: Strategies = {
  [Chain.Ethereum]: EthereumStrategy,
  [Chain.Polygon]: PolygonStrategy,
  [Chain.Gnosis]: GnosisStrategy,
  [Chain.Optimism]: OptimismStrategy,
  [Chain.Base]: OptimismStrategy,
  [Chain.Arbitrum]: ArbitrumStrategy,
  [Chain.Nova]: ArbitrumStrategy,
  [Chain.Linea]: LineaStrategy
}

export default DefaultStrategiesMap
