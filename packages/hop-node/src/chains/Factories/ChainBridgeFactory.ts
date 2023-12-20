import { ArbitrumBridge } from 'src/chains/Chains/arbitrum/ArbitrumBridge'
import { Chain } from 'src/constants'
import { GnosisBridge } from 'src/chains/Chains/gnosis/GnosisBridge'
import { IChainBridge } from 'src/chains/IChainBridge'
import { LineaBridge } from 'src/chains/Chains/linea/LineaBridge'
import { OptimismBridge } from 'src/chains/Chains/optimism/OptimismBridge'
import { PolygonBridge } from 'src/chains/Chains/polygon/PolygonBridge'
import { PolygonZkBridge } from 'src/chains/Chains/polygonzk/PolygonZkBridge'
import { ScrollZkBridge } from 'src/chains/Chains/scroll/ScrollBridge'
import { ZkSyncBridge } from 'src/chains/Chains/zksync/ZkSyncBridge'

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
