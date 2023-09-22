import { mainnet as _networks } from '@hop-protocol/core/networks'
import { mainnet as mainnetAddresses } from '@hop-protocol/core/addresses'
import { mainnet as metadata } from '@hop-protocol/core/metadata'

const addresses = mainnetAddresses.bridges
const bonders = mainnetAddresses.bonders
const canonicalAddresses = mainnetAddresses.canonicalAddresses
const networks: any = {}

for (const chain in _networks) {
  const network = (_networks as any)[chain]
  if (!networks[chain]) {
    networks[chain] = {}
  }
  networks[chain].name = network?.name
  networks[chain].chainId = network?.networkId
  networks[chain].rpcUrl = network?.publicRpcUrl
  networks[chain].waitConfirmations = network?.waitConfirmations
  networks[chain].hasFinalizationBlockTag = network?.hasFinalizationBlockTag
  networks[chain].subgraphUrl = network?.subgraphUrl
}

export { addresses, bonders, canonicalAddresses, networks, metadata }
