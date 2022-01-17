import { ChainSlug } from '@hop-protocol/sdk'
import filter from 'lodash/filter'
import find from 'lodash/find'
import Network from 'src/models/Network'
import { networks, hopAppNetwork } from './addresses'
import { metadata } from './metadata'

export const allNetworks = Object.keys(networks).map(key => {
  const net = networks[key]
  let meta = metadata.networks[key]

  if (key === ChainSlug.Ethereum) {
    meta = metadata.networks[hopAppNetwork]
  }

  return new Network({
    name: meta.name,
    slug: key,
    imageUrl: meta.image,
    rpcUrl: net.rpcUrl,
    networkId: net.networkId,
    nativeTokenSymbol: meta.nativeTokenSymbol,
    isLayer1: meta.isLayer1,
    nativeBridgeUrl: net.nativeBridgeUrl,
    waitConfirmations: net.waitConfirmations,
    explorerUrl: net.explorerUrl,
  })
})

export const l1Network = find(allNetworks, ['isLayer1', true])!
export const l2Networks = filter(allNetworks, ['isLayer1', false])
export const defaultL2Network = l2Networks[0]
