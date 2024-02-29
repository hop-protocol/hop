import { networks } from '@hop-protocol/core/networks'

export function getMinGasPrice (network: string, chain: string) {
  const networkObj = (networks as any)[network] 
  const chainObj = networkObj[chain]
  return chainObj?.txOverrides?.minGasPrice
}
