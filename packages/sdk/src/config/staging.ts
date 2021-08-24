import { staging as stagingAddresses } from '@hop-protocol/core/addresses'
import { mainnet as networks } from '@hop-protocol/core/networks'
import { Chains } from './types'

const chains: Chains = {}

for (let chain in networks) {
  const network = (networks as any)[chain] as any
  if (!chains[chain]) {
    chains[chain] = {}
  }
  chains[chain].name = network?.name
  chains[chain].chainId = network?.networkId
  chains[chain].rpcUrls = network?.rpcUrls
  chains[chain].explorerUrl = network?.explorerUrls?.[0]
}

const addresses = stagingAddresses.bridges
const bonders = stagingAddresses.bonders
export { addresses, chains, bonders }
