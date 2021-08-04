import { goerli as goerliAddresses } from '@hop-protocol/core/addresses'
import { goerli as networks } from '@hop-protocol/core/networks'
import { Chains } from './types'

const chains: Chains = {
  ethereum: {},
  polygon: {}
}

for (let chain in chains) {
  chains[chain].name = networks[chain]?.name
  chains[chain].chainId = networks[chain]?.networkId
  chains[chain].rpcUrls = networks[chain]?.rpcUrls
  chains[chain].explorerUrl = networks[chain]?.explorerUrls?.[0]
}

const addresses = goerliAddresses.bridges
const bonders = goerliAddresses.bonders
export { addresses, chains, bonders }
