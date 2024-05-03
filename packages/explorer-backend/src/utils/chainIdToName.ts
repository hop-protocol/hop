import { getSlugFromChainId } from './getSlugFromChainId'
import { chainSlugToName } from './chainSlugToName'

export function chainIdToName (chainId: number) {
  const name = chainSlugToName(getSlugFromChainId(chainId))
  if (!name) {
    throw new Error(`Unknown chain id ${chainId}`)
  }
  return name
}
