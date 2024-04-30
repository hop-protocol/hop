import { ChainSlug } from '../types.js'
import { getChain } from '../index.js'

export function chainIdToSlug(chainId: number): ChainSlug {
  return getChain(chainId).slug
}
