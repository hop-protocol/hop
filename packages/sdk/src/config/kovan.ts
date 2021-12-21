import { Chains } from './types'
import { kovan as kovanAddresses } from '@hop-protocol/core/addresses'
import { kovan as kovanConfig } from '@hop-protocol/core/config'
import { kovan as networks } from '@hop-protocol/core/networks'

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

const addresses = kovanAddresses.bridges
const bonders = kovanAddresses.bonders
const bonderFeeBps = kovanConfig.bonderFeeBps
const destinationFeeGasPriceMultiplier = kovanConfig.destinationFeeGasPriceMultiplier

export { addresses, chains, bonders, bonderFeeBps, destinationFeeGasPriceMultiplier }
