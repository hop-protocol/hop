import type { ChainSlug } from '../types.js'
import { getChainSlug } from '../index.js'

export function getSlugFromChainId(chainId: string): ChainSlug {
  return getChainSlug(chainId)
}
