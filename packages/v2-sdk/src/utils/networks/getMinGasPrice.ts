import { getChain } from './index.js'

export function getMinGasPrice (network: string, chain: string): number | undefined {
  return getChain(network, chain).txOverrides?.minGasPrice
}
