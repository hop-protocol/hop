import { mainnet as mainnetAddresses } from '@hop-protocol/addresses'
import { mainnet as _networks } from '@hop-protocol/networks'
import { Networks } from './types'

let networks: Networks = _networks
for (let network in networks) {
  networks[network].waitConfirmations = 12
}

const addresses = mainnetAddresses.bridges
const bonders = mainnetAddresses.bonders
export { addresses, networks, bonders }
