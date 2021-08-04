import { Network } from './types'
import { goerli as goerliAddresses } from '@hop-protocol/core/addresses'
import { goerli as networks } from '@hop-protocol/core/networks'

const addresses = goerliAddresses.bridges
const bonders = goerliAddresses.bonders

for (const key in networks) {
  if (networks[key]?.archiveRpcUrls.length) {
    ;(networks[key] as Network).readRpcUrl = networks[key].archiveRpcUrls[0]
  }
}

export { addresses, networks, bonders }
