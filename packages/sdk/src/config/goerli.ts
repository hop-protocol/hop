import { goerli as goerliAddresses } from '@hop-protocol/addresses'
import { goerli as networks } from '@hop-protocol/networks'
import { Chains } from './types'

const chains: Chains = {
  ethereum: {},
  polygon: {}
}

for (let chain in chains) {
  chains[chain].name = networks[chain]?.name
  chains[chain].chainId = networks[chain]?.networkId
  chains[chain].rpcUrl = networks[chain]?.rpcUrls?.[0]
  chains[chain].explorerUrl = networks[chain]?.explorerUrls?.[0]
}

const addresses = goerliAddresses.bridges
const bonders = goerliAddresses.bonders
export { addresses, chains, bonders }
