import type { BigNumber } from 'ethers'

export function bigNumberMin (a: BigNumber, b: BigNumber): BigNumber {
  return a.lt(b) ? a : b
}
