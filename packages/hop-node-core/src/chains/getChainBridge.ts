import { Chain } from '#constants/index.js'
import { IChainBridge } from './IChainBridge.js'
import { createChainBridgeInstance } from './Factories/ChainBridgeFactory.js'

const chainBridgeInstances: Record<string, IChainBridge> = {}

export function getChainBridge (chainSlug: Chain): IChainBridge {
  if (chainBridgeInstances?.[chainSlug]) {
    return chainBridgeInstances[chainSlug]
  }

  const chainBridge: IChainBridge = createChainBridgeInstance(chainSlug)
  chainBridgeInstances[chainSlug] = chainBridge
  return chainBridge
}
