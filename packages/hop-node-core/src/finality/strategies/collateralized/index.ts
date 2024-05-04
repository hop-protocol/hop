import { ArbitrumStrategy } from './ArbitrumStrategy.js'
import { EthereumStrategy } from './EthereumStrategy.js'
import { GnosisStrategy } from './GnosisStrategy.js'
import { LineaStrategy } from './LineaStrategy.js'
import { OptimismStrategy } from './OptimismStrategy.js'
import { PolygonStrategy } from './PolygonStrategy.js'
import { PolygonZkStrategy } from './PolygonZkStrategy.js'

import { ChainSlug } from '@hop-protocol/sdk'
import type { Strategies } from '../IFinalityStrategy.js'

export const CollateralizedStrategiesMap: Strategies = {
  [ChainSlug.Ethereum]: EthereumStrategy,
  [ChainSlug.Polygon]: PolygonStrategy,
  [ChainSlug.Gnosis]: GnosisStrategy,
  [ChainSlug.Optimism]: OptimismStrategy,
  [ChainSlug.Base]: OptimismStrategy,
  [ChainSlug.Arbitrum]: ArbitrumStrategy,
  [ChainSlug.Nova]: ArbitrumStrategy,
  [ChainSlug.Linea]: LineaStrategy,
  [ChainSlug.PolygonZk]: PolygonZkStrategy
}
