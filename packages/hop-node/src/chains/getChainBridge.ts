import '../moduleAlias'
import { ArbitrumBridge } from 'src/chains/Chains/arbitrum/ArbitrumBridge'
import { GnosisBridge } from 'src/chains/Chains/gnosis/GnosisBridge'
import { LineaBridge } from 'src/chains/Chains/linea/LineaBridge'
import { OptimismBridge } from 'src/chains/Chains/optimism/OptimismBridge'
import { PolygonBridge } from 'src/chains/Chains/polygon/PolygonBridge'
import { PolygonZkBridge } from 'src/chains/Chains/polygonzk/PolygonZkBridge'
import { ScrollZkBridge } from 'src/chains/Chains/scroll/ScrollBridge'
import { ZkSyncBridge } from 'src/chains/Chains/zksync/ZkSyncBridge'

import { Chain } from 'src/constants'
import { IChainBridge } from 'src/chains/IChainBridge'

const chainWatchers: Record<string, IChainBridge> = {}

const chainToBridgeMap: Record<string, new () => IChainBridge> = {
  [Chain.Optimism]: OptimismBridge,
  [Chain.Base]: OptimismBridge,
  [Chain.Arbitrum]: ArbitrumBridge,
  [Chain.Nova]: ArbitrumBridge,
  [Chain.Gnosis]: GnosisBridge,
  [Chain.Polygon]: PolygonBridge,
  [Chain.ZkSync]: ZkSyncBridge,
  [Chain.Linea]: LineaBridge,
  [Chain.ScrollZk]: ScrollZkBridge,
  [Chain.PolygonZk]: PolygonZkBridge
}

export default function getChainBridge (chainSlug: string): IChainBridge {
  if (!chainToBridgeMap[chainSlug]) {
    throw new Error(`Chain ${chainSlug} is not supported`)
  }

  if (chainWatchers?.[chainSlug]) {
    return chainWatchers[chainSlug]
  }

  const chainWatcher: IChainBridge = new chainToBridgeMap[chainSlug]()
  chainWatchers[chainSlug] = chainWatcher
  return chainWatcher
}
