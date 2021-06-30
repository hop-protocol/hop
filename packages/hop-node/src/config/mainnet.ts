import { mainnet as mainnetAddresses } from '@hop-protocol/addresses'
import { mainnet as networks } from '@hop-protocol/networks'
import { Networks } from './types'

const addresses = mainnetAddresses.bridges
const bonders = mainnetAddresses.bonders

// override polygon rpc url to use archive node
if (networks?.polygon) {
  networks.polygon.rpcUrls = ['https://matic-mainnet-archive-rpc.bwarelabs.com']
}

export { addresses, networks, bonders }
