import type { ChainSlug, NetworkSlug } from '../types.js'
import { getChain } from '../index.js'
import { isValidNetworkSlug } from './index.js'

export function getChainSlug(chainIdOrNetworkSlug: string | NetworkSlug, chainSlug?: ChainSlug): ChainSlug {
  // NetworkSlug needs to be explicitly checked since it overlaps with `string`
  if (isValidNetworkSlug(chainIdOrNetworkSlug) && chainSlug) {
    return getChain(chainIdOrNetworkSlug, chainSlug).slug
  } else {
    return getChain(chainIdOrNetworkSlug).slug
  }
}
