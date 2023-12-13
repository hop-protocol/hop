import { AbstractChainBridge, ChainBridgeParams } from 'src/chains/AbstractChainBridge'
import { ArbitrumBridgeParams } from 'src/chains/Chains/arbitrum/ArbitrumBridge'
import { Chain } from 'src/constants'
import { GnosisBridgeParams } from 'src/chains/Chains/gnosis/GnosisBridge'
import { IChainBridge } from 'src/chains/IChainBridge'
import { LineaBridgeParams } from 'src/chains/Chains/linea/LineaBridge'
import { OptimismBridgeParams } from 'src/chains/Chains/optimism/OptimismBridge'
import { PolygonBridgeParams } from 'src/chains/Chains/polygon/PolygonBridge'
import { PolygonZkBridgeParams } from 'src/chains/Chains/polygonzk/PolygonZkBridge'
import { ScrollZkBridgeParams } from 'src/chains/Chains/scroll/ScrollBridge'
import { ZkSyncBridgeParams } from 'src/chains/Chains/zksync/ZkSyncBridge'

const chainToBridgeParamsMap: Record<string, ChainBridgeParams> = {
  [Chain.Optimism]: OptimismBridgeParams,
  [Chain.Base]: OptimismBridgeParams,
  [Chain.Arbitrum]: ArbitrumBridgeParams,
  [Chain.Nova]: ArbitrumBridgeParams,
  [Chain.Gnosis]: GnosisBridgeParams,
  [Chain.Polygon]: PolygonBridgeParams,
  [Chain.ZkSync]: ZkSyncBridgeParams,
  [Chain.Linea]: LineaBridgeParams,
  [Chain.ScrollZk]: ScrollZkBridgeParams,
  [Chain.PolygonZk]: PolygonZkBridgeParams
}

export function createChainBridgeInstance (chainSlug: Chain): IChainBridge {
  if (!chainToBridgeParamsMap[chainSlug]) {
    throw new Error(`Chain ${chainSlug} is not supported`)
  }

  class ChainBridge extends AbstractChainBridge implements IChainBridge {}

  const bridgeParams: ChainBridgeParams = chainToBridgeParamsMap[chainSlug]
  return new ChainBridge(bridgeParams)
}
