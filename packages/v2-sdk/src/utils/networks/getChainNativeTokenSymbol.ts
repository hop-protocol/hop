import { getChain } from './index.js'
import { isValidNetworkSlug } from './index.js'

export function getChainNativeTokenSymbol(chainIdOrNetworkSlug: string, chainSlug?: string): string {
  // NetworkSlug needs to be explicitly checked since it overlaps with `string`
  if (isValidNetworkSlug(chainIdOrNetworkSlug) && chainSlug) {
    return getChain(chainIdOrNetworkSlug, chainSlug).nativeTokenSymbol
  } else {
    return getChain(chainIdOrNetworkSlug).nativeTokenSymbol
  }
}
