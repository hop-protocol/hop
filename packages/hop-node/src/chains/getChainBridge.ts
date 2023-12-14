import '../moduleAlias'
import { Chain } from 'src/constants'
import { IChainBridge } from 'src/chains/IChainBridge'
import { chainSlugToId } from 'src/utils/chainSlugToId'
import { createChainBridgeInstance } from 'src/chains/Factories/ChainBridgeFactory'

const chainBridgeInstances: Record<string, IChainBridge> = {}

export default function getChainBridge (chainSlug: Chain, chainId: number = chainSlugToId(chainSlug)): IChainBridge {
  const cacheKey = `${chainSlug}-${chainId}`
  if (chainBridgeInstances?.[cacheKey]) {
    return chainBridgeInstances[cacheKey]
  }

  const chainBridge: IChainBridge = createChainBridgeInstance(chainSlug, chainId)
  chainBridgeInstances[cacheKey] = chainBridge
  return chainBridge
}
