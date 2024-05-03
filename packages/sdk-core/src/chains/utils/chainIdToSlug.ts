import { ChainSlug } from '../types.js'
import { getChainSlug } from '../index.js'

export function chainIdToSlug(chainId: string): ChainSlug {
  return getChainSlug(chainId)
}
