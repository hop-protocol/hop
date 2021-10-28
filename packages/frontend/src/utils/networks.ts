import { find } from 'lodash'
import { networks } from 'src/config'
import Network from 'src/models/Network'

export function findNetworkBySlug(networks: Network[], slug) {
  return find(networks, ['slug', slug])
}

export function getNetworkWaitConfirmations(networkName: string) {
  return networks[networkName].waitConfirmations
}
