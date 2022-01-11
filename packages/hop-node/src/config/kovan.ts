import { kovan as _networks } from '@hop-protocol/core/networks'
import { kovan as kovanAddresses } from '@hop-protocol/core/addresses'
import { kovan as metadata } from '@hop-protocol/core/metadata'

const addresses = kovanAddresses.bridges
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
}

export { addresses, networks, metadata }
