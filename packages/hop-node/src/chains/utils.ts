import chainSlugToId from 'src/utils/chainSlugToId'
import { ChainSlug, NetworkSlug, networks } from '@hop-protocol/core/networks'

export function getNetworkSlugByChainId (chainId: number): string | undefined {
  for (const network in networks) {
    const chains = networks[network as NetworkSlug]
    for (const chain in chains) {
      const possibleChainId = chains?.[chain as ChainSlug]?.networkId
      if (chainId === possibleChainId) {
        return network
      }
    }
  }
}

export function getNetworkSlugByChainSlug (chainSlug: string): string | undefined {
  const chainId = chainSlugToId(chainSlug)
  return getNetworkSlugByChainId(chainId)
}
