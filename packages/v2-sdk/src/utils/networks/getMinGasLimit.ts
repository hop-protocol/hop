import { getChain } from './index.js'

export function getMinGasLimit (network: string, chain: string): number | undefined {
  return getChain(network, chain).txOverrides?.minGasLimit
}
