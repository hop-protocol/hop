import { Network } from './types'
import { kovan as kovanAddresses } from '@hop-protocol/addresses'
import { kovan as networks } from '@hop-protocol/networks'

const addresses = kovanAddresses.bridges
const bonders = kovanAddresses.bonders

for (const key in networks) {
  if (networks[key]?.archiveRpcUrls.length) {
    ;(networks[key] as Network).readRpcUrl = networks[key].archiveRpcUrls[0]
  }
}

export { addresses, networks, bonders }
