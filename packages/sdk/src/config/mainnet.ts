import { mainnet as mainnetAddresses } from '@hop-protocol/addresses'
import { mainnet as networks } from '@hop-protocol/networks'
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
  if (chain === 'xdai') {
    chains[chain].rpcUrls = [
      'https://dark-solitary-dawn.xdai.quiknode.pro/0d72762fc2a22e8c90437a0279b00e7fc11a7e3b/'
    ]
  }
  chains[chain].explorerUrl = networks[chain]?.explorerUrls?.[0]
}

const addresses = mainnetAddresses.bridges
const bonders = mainnetAddresses.bonders
export { addresses, chains, bonders }
