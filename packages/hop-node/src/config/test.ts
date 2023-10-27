import { mainnet as mainnetAddresses } from '@hop-protocol/core/addresses'
import { mainnet as metadata } from '@hop-protocol/core/metadata'
import { mainnet as networks } from '@hop-protocol/core/networks'

const addresses = mainnetAddresses.bridges
const bonders: {[token: string]: string[]} = {}
export { addresses, networks, bonders, metadata }
