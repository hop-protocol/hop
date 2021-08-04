import { mainnet as mainnetAddresses } from '@hop-protocol/core/addresses'
import { mainnet as networks } from '@hop-protocol/core/networks'
import { Chains } from './types'

const chains: Chains = {
  ethereum: {},
  xdai: {},
  polygon: {}
}

for (let chain in chains) {
  chains[chain].name = networks[chain]?.name
  chains[chain].chainId = networks[chain]?.networkId
  chains[chain].rpcUrls = networks[chain]?.rpcUrls
  chains[chain].explorerUrl = networks[chain]?.explorerUrls?.[0]
}

const addresses = mainnetAddresses.bridges
const bonders = mainnetAddresses.bonders
export { addresses, chains, bonders }
