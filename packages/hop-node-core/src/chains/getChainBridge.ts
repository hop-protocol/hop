import { Chain } from '#src/constants/index.js'
import { IChainBridge } from '#src/chains/IChainBridge.js'
import { createChainBridgeInstance } from '#src/chains/Factories/ChainBridgeFactory.js'

const chainBridgeInstances: Record<string, IChainBridge> = {}

export function getChainBridge (chainSlug: Chain): IChainBridge {
  if (chainBridgeInstances?.[chainSlug]) {
    return chainBridgeInstances[chainSlug]
  }

  const chainBridge: IChainBridge = createChainBridgeInstance(chainSlug)
  chainBridgeInstances[chainSlug] = chainBridge
  return chainBridge
}
