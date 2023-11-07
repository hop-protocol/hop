import { BonderConfig } from 'src/config/types'
import { mainnet as _networks } from '@hop-protocol/core/networks'
import { mainnet as config } from '@hop-protocol/core/config'
import { mainnet as mainnetAddresses } from '@hop-protocol/core/addresses'
import { mainnet as metadata } from '@hop-protocol/core/metadata'

const addresses = mainnetAddresses.bridges
const bonders = mainnetAddresses.bonders
const canonicalAddresses = mainnetAddresses.canonicalAddresses
const bonderConfig: BonderConfig = {}
const networks: any = {}

for (const chain in _networks) {
  const network = (_networks as any)[chain]
  if (!networks[chain]) {
    networks[chain] = {}
  }
  networks[chain].name = network?.name
  networks[chain].chainId = network?.networkId
  networks[chain].rpcUrl = network?.publicRpcUrl
  networks[chain].subgraphUrl = network?.subgraphUrl

  bonderConfig.totalStake = config.bonderTotalStake
}

export { addresses, bonders, canonicalAddresses, bonderConfig, networks, metadata }
