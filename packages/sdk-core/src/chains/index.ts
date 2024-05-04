import { networks } from './networks/index.js'
import type { Chain, Network } from './types.js'
import { ChainSlug, NetworkSlug } from './types.js'
import { getChainByChainId, getChainByNetworkSlugAndChainSlug } from './utils/internal.js'
import { isValidNetworkSlug } from './utils/isValidNetworkSlug.js'

/**
 * Types and utils
 */

export type { Chain, Network }
export { ChainSlug, NetworkSlug }
export * from './utils/index.js'

/**
 * Main methods to be consumed
 */

export function getNetwork (networkSlug: NetworkSlug): Network {
  return networks[networkSlug]
}

export const getNetworks = (): Network[] => {
  return Object.values(NetworkSlug).map(x => getNetwork(x))
}

export function getChain(chainId: string): Chain;
export function getChain(networkSlug: NetworkSlug, chainSlug: ChainSlug): Chain;
export function getChain(chainIdOrNetworkSlug: string | NetworkSlug, chainSlug?: ChainSlug): Chain {
  if (typeof chainIdOrNetworkSlug === 'string' && !chainSlug) {
    return getChainByChainId(chainIdOrNetworkSlug)
  } else if (isValidNetworkSlug(chainIdOrNetworkSlug) && chainSlug) {
    return getChainByNetworkSlugAndChainSlug(chainIdOrNetworkSlug, chainSlug)
  }
  throw new Error('Invalid arguments passed into getChain')
}

// Do not expose a getChains method indexed by chainId. This would return all chains for all networks, which
// should never be used. A consumer who wants this can make this call multiple times with different networks.
export function getChains(networkSlug: NetworkSlug): Chain[] {
  const chains = getNetwork(networkSlug).chains
  return Object.values(chains).map(chain => chain)
}
