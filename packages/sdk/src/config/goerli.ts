import { Chains } from './types'
import { goerli as goerliAddresses } from '@hop-protocol/core/addresses'
import { goerli as goerliConfig } from '@hop-protocol/core/config'
import { goerli as networks } from '@hop-protocol/core/networks'

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

const addresses = goerliAddresses.bridges
const bonders = goerliAddresses.bonders
const bonderFeeBps = goerliConfig.bonderFeeBps
const destinationFeeGasPriceMultiplier = goerliConfig.destinationFeeGasPriceMultiplier

export { addresses, chains, bonders, bonderFeeBps, destinationFeeGasPriceMultiplier }
