import type { ChainSlugish, NetworkSlugish } from '../types.js'
import { getChain } from '../index.js'

export function getMinGasPrice (network: NetworkSlugish, chain: ChainSlugish) {
  return getChain(network, chain).txOverrides?.minGasPrice
}
