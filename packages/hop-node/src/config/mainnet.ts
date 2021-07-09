import { Network } from './types'
import { mainnet as mainnetAddresses } from '@hop-protocol/addresses'
import { mainnet as networks } from '@hop-protocol/networks'

const addresses = mainnetAddresses.bridges
const bonders = mainnetAddresses.bonders

// override polygon rpc url to use archive node.
// this provider should only be used for read operations,
// since this particular endpoint doesn't handle well pending nonces.
if (networks?.polygon) {
  ;(networks.polygon as Network).readRpcUrl =
    'https://matic-mainnet-archive-rpc.bwarelabs.com'
}

export { addresses, networks, bonders }
