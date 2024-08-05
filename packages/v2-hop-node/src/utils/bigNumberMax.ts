import type { BigNumber } from 'ethers'

export function bigNumberMax (a: BigNumber, b: BigNumber): BigNumber {
  return a.gt(b) ? a : b
}
