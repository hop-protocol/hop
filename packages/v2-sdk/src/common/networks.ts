import { getNetworks } from '@hop-protocol/sdk'

export type Network = {
  name: string
  slug: string
  chainId: number
  publicRpcUrl: string
  fallbackPublicRpcUrls: string[]
  explorerUrls: string[]
  nativeBridgeUrl?: string
  primaryColor?: string
}

export type Networks = Record<string, Network>

export const networks: Record<string, Record<string, Network>> = {}

const allNetworks = getNetworks()

allNetworks.forEach(network => {
  networks[network.slug] = {}
  for (const chainSlug in network.chains) {
    const chain = (network as any).chains[chainSlug] // TODO: fix type
    networks[network.slug][chain.chainId] = {
      name: chain.name,
      slug: chain.slug,
      chainId: chain.chainId,
      publicRpcUrl: chain.publicRpcUrl,
      fallbackPublicRpcUrls: chain.fallbackPublicRpcUrls,
      explorerUrls: chain.explorerUrls,
      nativeBridgeUrl: chain.nativeBridgeUrl,
      primaryColor: chain.primaryColor,
    }
  }
})
