import { chainIdToSlug } from './chainIdToSlug'
import { chainSlugToName } from './chainSlugToName'

export function chainIdToName (chainId: number) {
  return chainSlugToName(chainIdToSlug(chainId))
}
