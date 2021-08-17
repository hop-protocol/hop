import { kovan as kovanAddresses } from '@hop-protocol/core/addresses'
import { kovan as metadata } from '@hop-protocol/core/metadata'
import { kovan as networks } from '@hop-protocol/core/networks'

const addresses = kovanAddresses.bridges
const bonders: {[token: string]: string[]} = {}
export { addresses, networks, bonders, metadata }
