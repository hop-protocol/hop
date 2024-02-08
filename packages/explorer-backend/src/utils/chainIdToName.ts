import { chainIdToSlug } from './chainIdToSlug'
import { chainSlugToName } from './chainSlugToName'

export function chainIdToName (chainId: number) {
  const name = chainSlugToName(chainIdToSlug(chainId))
  if (!name) {
    throw new Error(`Unknown chain id ${chainId}`)
  }
  return name
}
