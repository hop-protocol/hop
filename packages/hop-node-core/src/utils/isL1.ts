import { Chain } from '#src/constants/index.js'

export const isL1 = (network: string) => {
  return network === Chain.Ethereum
}
