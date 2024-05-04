import { getNetworks } from '@hop-protocol/sdk-core'

export type Network = {
  name: string
  chainId: number
  publicRpcUrl: string
  fallbackPublicRpcUrls: string[]
  explorerUrls: string[]
  nativeBridgeUrl?: string
}

export type Networks = Record<string, Network>

export const networks: Record<string, Record<string, Network>> = {}

const allNetworks = getNetworks()

for (const index in allNetworks) {
  const network = allNetworks[index]
  const chains = network.chains
  networks[network.slug] = {}
  for (const chainSlug in chains) {
    const chain = (chains as any)[chainSlug]
    networks[network.slug][chain.chainId] = {
      name: chain.name,
      chainId: chain.chainId,
      publicRpcUrl: chain.publicRpcUrl,
      fallbackPublicRpcUrls: chain.fallbackPublicRpcUrls,
      explorerUrls: chain.explorerUrls,
      nativeBridgeUrl: chain.nativeBridgeUrl
    }
  }
}
