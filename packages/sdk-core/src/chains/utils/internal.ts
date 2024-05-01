import { networks } from '../networks/index.js'
import { type Chain, ChainSlug, NetworkSlug } from '../types.js'

/**
 * These utils are intended to be used internally by this module only.
 * They are not exported from the main module.
 */

export function getChainByChainId(chainId: string): Chain {
  for (const network of Object.values(networks)) {
    for (const chain of Object.values(network.chains)) {
      if (chain.chainId === chainId) {
        return chain
      }
    }
  }
  throw new Error(`Chain with chainId ${chainId} not found`)
}


export function getChainByNetworkSlugAndChainSlug(networkSlug: NetworkSlug, chainSlug: ChainSlug): Chain {
  const chain: Chain | undefined = networks[networkSlug].chains?.[chainSlug]
  if (!chain) {
    throw new Error(`Chain with networkSlug ${networkSlug} and chainSlug ${chainSlug} not found`)
  }
  return chain
}
