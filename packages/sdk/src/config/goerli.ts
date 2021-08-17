import { goerli as goerliAddresses } from '@hop-protocol/core/addresses'
import { goerli as networks } from '@hop-protocol/core/networks'
import { Chains } from './types'

const chains: Chains = {
  ethereum: {},
  polygon: {}
}

for (let chain in chains) {
  const network = (networks as any)[chain] as any
  chains[chain].name = network?.name
  chains[chain].chainId = network?.networkId
  chains[chain].rpcUrls = network?.rpcUrls
  chains[chain].explorerUrl = network?.explorerUrls?.[0]
}

const addresses = goerliAddresses.bridges
const bonders = goerliAddresses.bonders
export { addresses, chains, bonders }
