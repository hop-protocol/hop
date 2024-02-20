import { ArbitrumBridge } from 'src/chains/Chains/arbitrum/ArbitrumBridge.js'
import { Chain } from 'src/constants/index.js'
import { GnosisBridge } from 'src/chains/Chains/gnosis/GnosisBridge.js'
import { IChainBridge } from 'src/chains/IChainBridge.js'
import { LineaBridge } from 'src/chains/Chains/linea/LineaBridge.js'
import { OptimismBridge } from 'src/chains/Chains/optimism/OptimismBridge.js'
import { PolygonBridge } from 'src/chains/Chains/polygon/PolygonBridge.js'
import { PolygonZkBridge } from 'src/chains/Chains/polygonzk/PolygonZkBridge.js'
import { ScrollZkBridge } from 'src/chains/Chains/scroll/ScrollBridge.js'
import { ZkSyncBridge } from 'src/chains/Chains/zksync/ZkSyncBridge.js'

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
