import { Chains } from './types'
import { mainnet as networks } from '@hop-protocol/core/networks'
import { staging as stagingAddresses } from '@hop-protocol/core/addresses'
import { staging as stagingConfig } from '@hop-protocol/core/config'

const chains: Chains = {}

for (const chain in networks) {
  const network = (networks as any)[chain] as any
  if (!chains[chain]) {
    chains[chain] = {}
  }
  chains[chain].name = network?.name
  chains[chain].chainId = network?.networkId
  chains[chain].rpcUrl = network?.publicRpcUrl
  chains[chain].explorerUrl = network?.explorerUrls?.[0]
}

const addresses = stagingAddresses.bridges
const bonders = stagingAddresses.bonders
const bonderFeeBps = stagingConfig.bonderFeeBps
const destinationFeeGasPriceMultiplier = stagingConfig.destinationFeeGasPriceMultiplier

export { addresses, chains, bonders, bonderFeeBps, destinationFeeGasPriceMultiplier }
