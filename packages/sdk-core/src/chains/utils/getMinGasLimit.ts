import type { ChainSlug, NetworkSlug } from '../types.js'
import { getChain } from '../index.js'

export function getMinGasLimit (network: NetworkSlug, chain: ChainSlug) {
  return getChain(network, chain).txOverrides?.minGasLimit
}
