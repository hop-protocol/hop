import { Network } from './types'
import { mainnet as mainnetAddresses } from '@hop-protocol/addresses'
import { mainnet as networks } from '@hop-protocol/networks'

const addresses = mainnetAddresses.bridges
const bonders = mainnetAddresses.bonders

for (const key in networks) {
  if (networks[key]?.archiveRpcUrls.length) {
    ;(networks[key] as Network).readRpcUrl = networks[key].archiveRpcUrls[0]
  }
}

export { addresses, networks, bonders }
