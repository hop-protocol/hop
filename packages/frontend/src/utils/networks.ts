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
