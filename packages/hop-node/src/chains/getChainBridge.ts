import '../moduleAlias'
import ArbitrumBridge from './Chains/arbitrum/ArbitrumBridge'
import GnosisBridge from './Chains/gnosis/GnosisBridge'
import LineaBridge from './Chains/linea/LineaBridge'
import OptimismBridge from './Chains/optimism/OptimismBridge'
import PolygonBridge from './Chains/polygon/PolygonBridge'
import PolygonZkBridge from './Chains/polygonzk/PolygonZkBridge'
import ScrollBridge from './Chains/scroll/ScrollBridge'
import ZkSyncBridge from './Chains/zksync/ZkSyncBridge'

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

  const chainWatcher: IChainBridge = new chainToBridgeMap[chainSlug](chainSlug)
  chainWatchers[chainSlug] = chainWatcher
  return chainWatcher
}
