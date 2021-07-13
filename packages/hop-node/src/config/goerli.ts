import { Network } from './types'
import { goerli as goerliAddresses } from '@hop-protocol/addresses'
import { goerli as networks } from '@hop-protocol/networks'

const addresses = goerliAddresses.bridges
const bonders = goerliAddresses.bonders

// override polygon rpc url to use archive node.
// this provider should only be used for read operations,
// since this particular endpoint doesn't handle well pending nonces.
if (networks?.polygon) {
  ;(networks.polygon as Network).readRpcUrl =
    'https://matic-testnet-archive-rpc.bwarelabs.com'
}

export { addresses, networks, bonders }
