import { Chains } from './types'
import { mainnet as mainnetAddresses } from '@hop-protocol/core/addresses'
import { mainnet as mainnetConfig } from '@hop-protocol/core/config'
import { mainnet as networks } from '@hop-protocol/core/networks'

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

const addresses = mainnetAddresses.bridges
const bonders = mainnetAddresses.bonders
const bonderFeeBps = mainnetConfig.bonderFeeBps
const destinationFeeGasPriceMultiplier = mainnetConfig.destinationFeeGasPriceMultiplier

export { addresses, chains, bonders, bonderFeeBps, destinationFeeGasPriceMultiplier }
