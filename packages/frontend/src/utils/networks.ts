import { TChain } from '@hop-protocol/sdk'
import { find } from 'lodash'
import { networks } from 'src/config'
import Network from 'src/models/Network'

export function findNetworkBySlug(networks: Network[], slug) {
  return find(networks, ['slug', slug])
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
