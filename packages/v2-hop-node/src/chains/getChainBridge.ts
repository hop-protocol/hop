import { createChainBridgeInstance } from './Factories/ChainBridgeFactory.js'
import type { IChainBridge } from './IChainBridge.js'
import type { ChainSlug } from '@hop-protocol/sdk'

const chainBridgeInstances: Record<string, IChainBridge> = {}

export function getChainBridge (chainSlug: ChainSlug): IChainBridge {
  const instance = chainBridgeInstances[chainSlug]
  if (typeof instance !== 'undefined') {
    return instance
  }

  const chainBridge: IChainBridge = createChainBridgeInstance(chainSlug)
  chainBridgeInstances[chainSlug] = chainBridge
  return chainBridge
}
