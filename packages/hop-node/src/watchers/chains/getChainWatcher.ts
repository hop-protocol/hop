import '../../moduleAlias'
import GnosisBridgeWatcher from './gnosis/GnosisBridgeWatcher'
import PolygonBridgeWatcher from './polygon/PolygonBridgeWatcher'
import OptimismBridgeWatcher from './optimism/OptimismBridgeWatcher'
import ArbitrumBridgeWatcher from './arbitrum/ArbitrumBridgeWatcher'
import NovaBridgeWatcher from './arbitrum/NovaBridgeWatcher'
import ZkSyncBridgeWatcher from './zksync/ZkSyncBridgeWatcher'
import LineaBridgeWatcher from './linea/LineaBridgeWatcher'
import ScrollZkBridgeWatcher from './scroll/ScrollZkBridgeWatcher'
import BaseZkBridgeWatcher from './optimism/BaseZkBridgeWatcher'
import PolygonZkBridgeWatcher from './polygonzk/PolygonZkBridgeWatcher'

import { Chain } from 'src/constants'
import { IChainWatcher } from '../classes/IChainWatcher'

const chainWatchers: Record<string, IChainWatcher> = {}

export default function getChainWatcher (chainSlug: string): IChainWatcher {
  if (chainWatchers[chainSlug]) {
    return this.chainWatchers[chainSlug]
  }

  let chainWatcher: IChainWatcher
  if (chainSlug === Chain.Gnosis) {
    chainWatcher = new GnosisBridgeWatcher()
  } else if (chainSlug === Chain.Polygon) {
    chainWatcher = new PolygonBridgeWatcher()
  } else if (chainSlug === Chain.Optimism) {
    chainWatcher = new OptimismBridgeWatcher()
  } else if (chainSlug === Chain.Arbitrum) {
    chainWatcher = new ArbitrumBridgeWatcher()
  } else if (chainSlug === Chain.Nova) {
    chainWatcher = new NovaBridgeWatcher()
  } else if (chainSlug === Chain.ZkSync) {
    chainWatcher = new ZkSyncBridgeWatcher()
  } else if (chainSlug === Chain.Linea) {
    chainWatcher = new LineaBridgeWatcher()
  } else if (chainSlug === Chain.ScrollZk) {
    chainWatcher = new ScrollZkBridgeWatcher()
  } else if (chainSlug === Chain.Base) {
    chainWatcher = new BaseZkBridgeWatcher()
  } else if (chainSlug === Chain.PolygonZk) {
    chainWatcher = new PolygonZkBridgeWatcher()
  } else {
    throw new Error(`Chain ${chainSlug} is not supported`)
  }

  this.chainWatchers[chainSlug] = chainWatcher
  return chainWatcher
}