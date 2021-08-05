import { Network } from './types'
import { mainnet as networks } from '@hop-protocol/core/networks'
import { staging as stagingAddresses } from '@hop-protocol/core/addresses'

const addresses = stagingAddresses.bridges
const bonders = stagingAddresses.bonders

for (const key in networks) {
  if (networks[key]?.archiveRpcUrls.length) {
    ;(networks[key] as Network).readRpcUrl = networks[key].archiveRpcUrls[0]
  }
}

export { addresses, networks, bonders }
