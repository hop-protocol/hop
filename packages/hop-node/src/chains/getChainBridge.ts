import '../moduleAlias'
import GnosisBridge from './gnosis/GnosisBridge'
import PolygonBridge from './polygon/PolygonBridge'
import OptimismBridge from './optimism/OptimismBridge'
import ArbitrumBridge from './arbitrum/ArbitrumBridge'
import NovaBridge from './arbitrum/NovaBridge'
import ZkSyncBridge from './zksync/ZkSyncBridge'
import LineaBridge from './linea/LineaBridge'
import ScrollBridge from './scroll/ScrollBridge'
import BaseBridge from './optimism/BaseBridge'
import PolygonZkBridge from './polygonzk/PolygonZkBridge'

import { Chain } from 'src/constants'
import { IChainBridge } from './IChainBridge'

const chainWatchers: Record<string, IChainBridge> = {}

export default function getChainBridge (chainSlug: string): IChainBridge {
  if (chainWatchers?.[chainSlug]) {
    return this.chainWatchers[chainSlug]
  }

  let chainWatcher: IChainBridge
  if (chainSlug === Chain.Gnosis) {
    chainWatcher = new GnosisBridge()
  } else if (chainSlug === Chain.Polygon) {
    chainWatcher = new PolygonBridge()
  } else if (chainSlug === Chain.Optimism) {
    chainWatcher = new OptimismBridge()
  } else if (chainSlug === Chain.Arbitrum) {
    chainWatcher = new ArbitrumBridge()
  } else if (chainSlug === Chain.Nova) {
    chainWatcher = new NovaBridge()
  } else if (chainSlug === Chain.ZkSync) {
    chainWatcher = new ZkSyncBridge()
  } else if (chainSlug === Chain.Linea) {
    chainWatcher = new LineaBridge()
  } else if (chainSlug === Chain.ScrollZk) {
    chainWatcher = new ScrollBridge()
  } else if (chainSlug === Chain.Base) {
    chainWatcher = new BaseBridge()
  } else if (chainSlug === Chain.PolygonZk) {
    chainWatcher = new PolygonZkBridge()
  } else {
    throw new Error(`Chain ${chainSlug} is not supported`)
  }

  chainWatchers[chainSlug] = chainWatcher
  return chainWatcher
}