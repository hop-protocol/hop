import * as networks from '@hop-protocol/core/networks'

export function getMinGasLimit (network: string, chain: string) {
  const networkObj = (networks as any)[network] as any
  const chainObj = networkObj[chain]
  return chainObj?.txOverrides?.minGasLimit
}
