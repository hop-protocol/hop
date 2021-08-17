import { staging as stagingAddresses } from '@hop-protocol/core/addresses'
import { mainnet as networks } from '@hop-protocol/core/networks'
import { Chains } from './types'

const chains: Chains = {
  ethereum: {},
  xdai: {},
  polygon: {}
}

for (let chain in chains) {
  const network = (networks as any)[chain] as any
  chains[chain].name = network?.name
  chains[chain].chainId = network?.networkId
  chains[chain].rpcUrls = network?.rpcUrls
  chains[chain].explorerUrl = network?.explorerUrls?.[0]
}

const addresses = stagingAddresses.bridges
const bonders = stagingAddresses.bonders
export { addresses, chains, bonders }
