import { TChain } from '@hop-protocol/sdk'
import { find } from 'lodash'
import { networks } from 'src/config'
import { allNetworks } from 'src/config/networks'
import Network from 'src/models/Network'

export function findNetworkBySlug(slug: string) {
  return find(allNetworks, ['slug', slug])
}

export const networkSlugToId = (slug: string) => {
  return networks[slug]?.networkId
}

export const networkSlugToName = (slug: string) => {
  const n = findNetworkBySlug(slug)
  return n?.name
}

export const networkIdToSlug = (networkId: string | number): string => {
  if (typeof networkId === 'number') {
    networkId = networkId.toString()
  }

  for (const key in networks) {
    const v = networks[key]
    if (v.networkId.toString() === networkId) {
      return key
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
  if (slug === 'gnosis') {
    return 'XDAI'
  } else if (slug === 'polygon') {
    return 'MATIC'
  }
  return 'ETH'
}

export function getNetworkWaitConfirmations(tChain: TChain) {
  if (typeof tChain === 'string') {
    return networks[tChain].waitConfirmations
  }
  return networks[tChain.slug].waitConfirmations
}

export function isL1ToL2(srcNetwork: Network, destNetwork: Network) {
  if (srcNetwork.isLayer1 && !destNetwork.isLayer1) {
    return true
  }

  return false
}
