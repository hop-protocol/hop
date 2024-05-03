import { ArbitrumBridge } from '../Chains/arbitrum/ArbitrumBridge.js'
import { GnosisBridge } from '../Chains/gnosis/GnosisBridge.js'
import { LineaBridge } from '../Chains/linea/LineaBridge.js'
import { OptimismBridge } from '../Chains/optimism/OptimismBridge.js'
import { PolygonBridge } from '../Chains/polygon/PolygonBridge.js'
import { PolygonZkBridge } from '../Chains/polygonzk/PolygonZkBridge.js'
import { ScrollZkBridge } from '../Chains/scroll/ScrollBridge.js'
import { ZkSyncBridge } from '../Chains/zksync/ZkSyncBridge.js'
import { ChainSlug } from '@hop-protocol/sdk'
import type { IChainBridge } from '../IChainBridge.js'

// Maps chainSlugs to their respective superchain classes
const chainBridgeMap: Record<string, new (chainSlug: ChainSlug) => IChainBridge> = {
  [ChainSlug.Optimism]: OptimismBridge,
  [ChainSlug.Base]: OptimismBridge,
  [ChainSlug.Arbitrum]: ArbitrumBridge,
  [ChainSlug.Nova]: ArbitrumBridge,
  [ChainSlug.Gnosis]: GnosisBridge,
  [ChainSlug.Polygon]: PolygonBridge,
  [ChainSlug.ZkSync]: ZkSyncBridge,
  [ChainSlug.Linea]: LineaBridge,
  [ChainSlug.ScrollZk]: ScrollZkBridge,
  [ChainSlug.PolygonZk]: PolygonZkBridge
}

export function createChainBridgeInstance (chainSlug: ChainSlug): IChainBridge {
  if (!chainBridgeMap[chainSlug]) {
    throw new Error(`Chain ${chainSlug} is not supported`)
  }
  return new chainBridgeMap[chainSlug]!(chainSlug)
}
