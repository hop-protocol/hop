import { ArbitrumBridge } from '../Chains/arbitrum/ArbitrumBridge.js'
import { Chain } from '#constants/index.js'
import { GnosisBridge } from '../Chains/gnosis/GnosisBridge.js'
import { IChainBridge } from '../IChainBridge.js'
import { LineaBridge } from '../Chains/linea/LineaBridge.js'
import { OptimismBridge } from '../Chains/optimism/OptimismBridge.js'
import { PolygonBridge } from '../Chains/polygon/PolygonBridge.js'
import { PolygonZkBridge } from '../Chains/polygonzk/PolygonZkBridge.js'
import { ScrollZkBridge } from '../Chains/scroll/ScrollBridge.js'
import { ZkSyncBridge } from '../Chains/zksync/ZkSyncBridge.js'

// Maps chainSlugs to their respective superchain classes
const chainBridgeMap: Record<string, new (chainSlug: string) => IChainBridge> = {
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

export function createChainBridgeInstance (chainSlug: Chain): IChainBridge {
  if (!chainBridgeMap[chainSlug]) {
    throw new Error(`Chain ${chainSlug} is not supported`)
  }
  return new chainBridgeMap[chainSlug](chainSlug)
}
