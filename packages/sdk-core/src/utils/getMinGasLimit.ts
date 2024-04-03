import { networks } from '#networks/index.js'

export function getMinGasLimit (network: string, chain: string) {
  const networkObj = (networks as any)[network]
  const chainObj = networkObj[chain]
  return chainObj?.txOverrides?.minGasLimit
}
