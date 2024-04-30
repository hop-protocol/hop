import { chainSlugToId } from '#utils/chainSlugToId.js'
import type { NetworkSlug } from '@hop-protocol/sdk'
import { getNetworks } from '@hop-protocol/sdk'

export function getNetworkSlugByChainId (chainId: number): NetworkSlug | undefined {
  for (const network of getNetworks()) {
    for (const chain of Object.values(network.chains)) {
      if (chainId === chain.chainId) {
        return network.slug
      }
    }
  }
}

export function getNetworkSlugByChainSlug (chainSlug: string): string | undefined {
  const chainId = chainSlugToId(chainSlug)
  return getNetworkSlugByChainId(chainId)
}
