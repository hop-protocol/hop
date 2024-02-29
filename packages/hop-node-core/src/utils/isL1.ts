import { Chain } from '#constants/index.js'

export const isL1 = (network: string) => {
  return network === Chain.Ethereum
}
