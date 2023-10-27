import '../moduleAlias'
import ArbitrumBridge from './arbitrum/ArbitrumBridge'
import GnosisBridge from './gnosis/GnosisBridge'
import LineaBridge from './linea/LineaBridge'
import OptimismBridge from './optimism/OptimismBridge'
import PolygonBridge from './polygon/PolygonBridge'
import PolygonZkBridge from './polygonzk/PolygonZkBridge'
import ScrollBridge from './scroll/ScrollBridge'
import ZkSyncBridge from './zksync/ZkSyncBridge'

import { Chain } from 'src/constants'
import { IChainBridge } from './IChainBridge'

const chainWatchers: Record<string, IChainBridge> = {}

const chainToBridgeMap: Record<string, new (slug: string) => IChainBridge> = {
  [Chain.Optimism]: OptimismBridge,
  [Chain.Base]: OptimismBridge,
  [Chain.Arbitrum]: ArbitrumBridge,
  [Chain.Nova]: ArbitrumBridge,
  [Chain.Gnosis]: GnosisBridge,
  [Chain.Polygon]: PolygonBridge,
  [Chain.ZkSync]: ZkSyncBridge,
  [Chain.Linea]: LineaBridge,
  [Chain.ScrollZk]: ScrollBridge,
  [Chain.PolygonZk]: PolygonZkBridge
}

export default function getChainBridge (chainSlug: string): IChainBridge {
  if (!chainToBridgeMap[chainSlug]) {
    throw new Error(`Chain ${chainSlug} is not supported`)
  }

  if (chainWatchers?.[chainSlug]) {
    return chainWatchers[chainSlug]
  }

  let chainWatcher: IChainBridge = new chainToBridgeMap[chainSlug](chainSlug)
  chainWatchers[chainSlug] = chainWatcher
  return chainWatcher
}
