/**
 * Internal utils are intentionally not exported here since they are only
 * meant to be used internally to this module.
 */

import type { ChainConfig, NetworkConfig } from '../../config/networks/types.js'
import { getChainByChainId, getChainByNetworkSlugAndChainSlug } from './internal.js'
import { isValidNetworkSlug } from './isValidNetworkSlug.js'
import { networks } from '../../config/networks/index.js'

export { getSlugFromChainId } from './getSlugFromChainId.js'
export { getChainNativeTokenSymbol } from './getChainNativeTokenSymbol.js'
export { getChainSlug } from './getChainSlug.js'
export { getMinGasLimit } from './getMinGasLimit.js'
export { getMinGasPrice } from './getMinGasPrice.js'
export { isValidChainSlug } from './isValidChainSlug.js'
export { isValidNetworkSlug } from './isValidNetworkSlug.js'

export function getNetwork (networkSlug: string): NetworkConfig {
  return networks[networkSlug]
}

export const getNetworks = (): NetworkConfig[] => {
  return Object.values(networks)
}

export function getChain(chainId: string): ChainConfig
export function getChain(networkSlug: string, chainSlug: string): ChainConfig
export function getChain(chainIdOrNetworkSlug: string, chainSlug?: string): ChainConfig {
  if (typeof chainIdOrNetworkSlug === 'string' && !chainSlug) {
    return getChainByChainId(chainIdOrNetworkSlug)
  } else if (isValidNetworkSlug(chainIdOrNetworkSlug) && chainSlug) {
    return getChainByNetworkSlugAndChainSlug(chainIdOrNetworkSlug, chainSlug)
  }
  throw new Error('Invalid arguments passed into getChain')
}

// Do not expose a getChains method indexed by chainId. This would return all chains for all networks, which
// should never be used. A consumer who wants this can make this call multiple times with different networks.
export function getChains(networkSlug: string): ChainConfig[] {
  const chains = getNetwork(networkSlug).chains
  return Object.values(chains).map(chain => chain)
}
