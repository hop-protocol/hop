import Network from 'src/models/Network'
import filter from 'lodash/filter'
import find from 'lodash/find'
import { ChainSlug, NetworkSlug, getChain } from '@hop-protocol/sdk'
import { networks } from 'src/config/addresses'
import { reactAppNetwork } from 'src/config'

export const allNetworks = Object.keys(networks).map(key => {
  const net = networks[key]
  const meta = getChain(reactAppNetwork as NetworkSlug, key as ChainSlug)

  if (key === ChainSlug.Ethereum) {
    // meta = metadata.networks[reactAppNetwork]
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
})
.filter(Boolean)

export const l1Network = find(allNetworks, ['isLayer1', true])!
export const l2Networks = filter(allNetworks, ['isLayer1', false])
export const defaultL2Network = l2Networks[0]
