import Network from '#models/Network.js'
import filter from 'lodash/filter'
import find from 'lodash/find'
import { ChainSlug, NetworkSlug, getChain } from '@hop-protocol/sdk'
import { networks } from '#config/addresses.js'
import { reactAppNetwork } from '#config/index.js'

export function getNetworks(networkSlug: string) {
  return Object.keys(networks).map(key => {
    try {
    const net = networks[key]
    const meta = getChain(networkSlug as NetworkSlug, key as ChainSlug)

    if (key === ChainSlug.Ethereum) {
      // meta = metadata.networks[networkSlug]
    }

    if (!(net && meta && net?.rpcUrl)) {
      return null
    }

    return new Network({
      name: meta.name,
      slug: key,
      imageUrl: meta.image,
      rpcUrl: net.rpcUrl,
      fallbackRpcUrls: net.fallbackRpcUrls ?? [],
      networkId: Number(meta.chainId),
      nativeTokenSymbol: meta.nativeTokenSymbol,
      isLayer1: meta.isL1,
      explorerUrl: net.explorerUrl
    })
    } catch (err: any) {
      console.warn('getNetworks error', err, networkSlug, key)
    }

    return null
  })
  .filter(Boolean)
}

export const allNetworks = getNetworks(reactAppNetwork)

export const l1Network = find(allNetworks, ['isLayer1', true])!
export const l2Networks = filter(allNetworks, ['isLayer1', false])
export const defaultL2Network = l2Networks[0]
