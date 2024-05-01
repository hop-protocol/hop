import { ChainSlug } from '../types.js'
import { getChain } from '../index.js'

export function chainIdToSlug(chainId: string): ChainSlug {
  return getChain(chainId).slug
}
