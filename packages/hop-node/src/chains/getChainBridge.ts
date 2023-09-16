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

export default function getChainBridge (chainSlug: string): IChainBridge {
  if (chainWatchers?.[chainSlug]) {
    return chainWatchers[chainSlug]
  }

  let chainWatcher: IChainBridge
  if (chainSlug === Chain.Optimism || chainSlug === Chain.Base) {
    chainWatcher = new OptimismBridge(chainSlug)
  } else if (chainSlug === Chain.Arbitrum || chainSlug === Chain.Nova) {
    chainWatcher = new ArbitrumBridge(chainSlug)
  } else if (chainSlug === Chain.Gnosis) {
    chainWatcher = new GnosisBridge(chainSlug)
  } else if (chainSlug === Chain.Polygon) {
    chainWatcher = new PolygonBridge(chainSlug)
  } else if (chainSlug === Chain.ZkSync) {
    chainWatcher = new ZkSyncBridge(chainSlug)
  } else if (chainSlug === Chain.Linea) {
    chainWatcher = new LineaBridge(chainSlug)
  } else if (chainSlug === Chain.ScrollZk) {
    chainWatcher = new ScrollBridge(chainSlug)
  } else if (chainSlug === Chain.PolygonZk) {
    chainWatcher = new PolygonZkBridge(chainSlug)
  } else {
    throw new Error(`Chain ${chainSlug} is not supported`)
  }

  chainWatchers[chainSlug] = chainWatcher
  return chainWatcher
}
