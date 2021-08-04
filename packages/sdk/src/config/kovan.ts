import { kovan as kovanAddresses } from '@hop-protocol/core/addresses'
import { kovan as networks } from '@hop-protocol/core/networks'
import { Chains } from './types'

const chains: Chains = {
  ethereum: {},
  arbitrum: {},
  optimism: {},
  xdai: {}
}

for (let chain in chains) {
  chains[chain].name = networks[chain]?.name
  chains[chain].chainId = networks[chain]?.networkId
  chains[chain].rpcUrls = networks[chain]?.rpcUrls
  chains[chain].explorerUrl = networks[chain]?.explorerUrls?.[0]
}

const addresses = kovanAddresses.bridges
const bonders = kovanAddresses.bonders
export { addresses, chains, bonders }
