import '../moduleAlias'
import { Chain } from 'src/constants'
import { IChainBridge } from 'src/chains/IChainBridge'
import { createChainBridgeInstance } from 'src/chains/Factories/ChainBridgeFactory'

const chainBridgeInstances: Record<string, IChainBridge> = {}

export default function getChainBridge (chainSlug: Chain): IChainBridge {
  if (chainBridgeInstances?.[chainSlug]) {
    return chainBridgeInstances[chainSlug]
  }

  const chainBridge: IChainBridge = createChainBridgeInstance(chainSlug)
  chainBridgeInstances[chainSlug] = chainBridge
  return chainBridge
}
