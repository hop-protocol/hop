import { JsonRpcProvider } from '@ethersproject/providers'
import { CanonicalToken, ChainId, ChainSlug, Slug, TChain } from '@hop-protocol/sdk'
import { Signer, providers } from 'ethers'
import find from 'lodash/find'
import { networks } from 'src/config'
import { allNetworks } from 'src/config/networks'
import Chain, { Chainish } from 'src/models/Chain'

export function findNetworkById(networkId: number, networks: Chain[] = allNetworks) {
  return find(networks, ['networkId', networkId])
}

export function findNetworkBySlug(slug: string, networks: Chain[] = allNetworks) {
  return find(networks, ['slug', slug])
}

export function findNetwork(slugOrNetwork?: string | Chain, networks: Chain[] = allNetworks) {
  return find(networks, [
    'slug',
    slugOrNetwork instanceof Chain ? slugOrNetwork.slug : slugOrNetwork,
  ])
}

function normalizeNetworkToSlug(network?: Chainish) {
  if (network instanceof Chain) {
    return network.slug
  }
  if (typeof network === 'string' && network in Slug) {
    return network
  }
  if (typeof network === 'number') {
    return networkIdToSlug(network)
  }
}

export function isSameNetwork(network1?: Chainish, network2?: Chainish) {
  const slug1 = normalizeNetworkToSlug(network1)
  const slug2 = normalizeNetworkToSlug(network2)
  return slug1 === slug2
}

export const networkSlugToId = (slug: string) => {
  return networks[slug]?.networkId
}

export const networkSlugToName = (slug: string) => {
  const n = findNetworkBySlug(slug)
  return n?.name
}

export const networkIdToSlug = (networkId: string | number | undefined): Slug | string => {
  if (networkId === undefined) {
    return ''
  }

  if (typeof networkId === 'number') {
    networkId = networkId.toString()
  }

  for (const key in networks) {
    const v = networks[key]
    if (v.networkId.toString() === networkId) {
      return key as Slug
    }
  }

  return ''
}

export const networkIdToName = (networkId: string | number) => {
  const name = networkSlugToName(networkIdToSlug(networkId))
  return name
}

export const networkIdNativeTokenSymbol = (networkId: string | number) => {
  const slug = networkIdToSlug(networkId)
  if (slug === ChainSlug.Gnosis) {
    return CanonicalToken.XDAI
  } else if (slug === ChainSlug.Polygon) {
    return CanonicalToken.MATIC
  }
  return CanonicalToken.ETH
}

export function getNetworkWaitConfirmations(tChain: TChain) {
  if (typeof tChain === 'string') {
    return networks[tChain].waitConfirmations
  }
  return networks[tChain.slug].waitConfirmations
}

export function isLayer1(chain?: Chainish) {
  if (chain instanceof Chain) {
    return chain.isLayer1
  }
  if (typeof chain === 'string' && chain in Slug) {
    return chain === ChainSlug.Ethereum
  }
  if (typeof chain === 'number') {
    return chain === ChainId.Ethereum
  }
  return false
}

export function isL1ToL2(sourceChain?: Chainish, destinationChain?: Chainish) {
  const srcCheck = isLayer1(sourceChain)
  const destCheck = !isLayer1(destinationChain)

  return srcCheck && destCheck
}

export function isL2ToL1(sourceChain?: Chainish, destinationChain?: Chainish) {
  const srcCheck = !isLayer1(sourceChain)
  const destCheck = isLayer1(destinationChain)

  return srcCheck && destCheck
}

export function isL2ToL2(sourceChain?: Chainish, destinationChain?: Chainish) {
  const srcCheck = !isLayer1(sourceChain)
  const destCheck = !isLayer1(destinationChain)

  return srcCheck && destCheck
}

export function isProviderNetworkByChainId(chainId: ChainId, provider?: JsonRpcProvider) {
  if (!provider) return false

  if (chainId in ChainId) {
    return chainId === provider.network.chainId
  }
}

export function getNetworkProviderOrDefault(
  chainId: ChainId,
  defaultProvider: providers.Provider | Signer,
  provider?: JsonRpcProvider
) {
  if (isProviderNetworkByChainId(chainId, provider)) return provider!

  return defaultProvider
}
