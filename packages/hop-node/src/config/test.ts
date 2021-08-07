import { kovan as kovanAddresses } from '@hop-protocol/core/addresses'
import { kovan as networks } from '@hop-protocol/core/networks'

const addresses = kovanAddresses.bridges
const bonders: {[token: string]: string[]} = {}
export { addresses, networks, bonders }
