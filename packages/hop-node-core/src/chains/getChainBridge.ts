import { Chain } from '#constants/index.js'
import { type IChainBridge } from './IChainBridge.js'
import { createChainBridgeInstance } from './Factories/ChainBridgeFactory.js'

const chainBridgeInstances: Record<string, IChainBridge> = {}

export function getChainBridge (chainSlug: Chain): IChainBridge {
  const instance = chainBridgeInstances?.[chainSlug]
  if (instance) {
    return instance
  }

  const chainBridge: IChainBridge = createChainBridgeInstance(chainSlug)
  chainBridgeInstances[chainSlug] = chainBridge
  return chainBridge
}
