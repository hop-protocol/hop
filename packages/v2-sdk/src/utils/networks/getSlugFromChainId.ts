import { getChainSlug } from './index.js'

export function getSlugFromChainId(chainId: string): string {
  return getChainSlug(chainId)
}
