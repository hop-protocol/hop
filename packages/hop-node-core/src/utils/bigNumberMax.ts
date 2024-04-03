import { BigNumber } from 'ethers'

export function bigNumberMax (a: BigNumber, b: BigNumber) {
  if (!a) {
    return b
  }
  if (!b) {
    return a
  }
  return a?.gt(b) ? a : b
}
