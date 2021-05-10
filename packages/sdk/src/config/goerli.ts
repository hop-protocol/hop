import { goerli as addresses } from '@hop-protocol/addresses'
import { goerli as networks } from '@hop-protocol/networks'
import { Chains } from './types'

const chains: Chains = {
  ethereum: {
    name: 'Goerli'
  },
  polygon: {
    name: 'Polygon'
  }
}

for (let chain in chains) {
  chains[chain].chainId = networks[chain]?.networkId
  chains[chain].rpcUrl = networks[chain]?.rpcUrls?.[0]
  chains[chain].explorerUrl = networks[chain]?.explorerUrls?.[0]
}

export { addresses, chains }
