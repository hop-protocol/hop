import { BigNumber } from 'ethers'

export function bigNumberMin(a: BigNumber, b: BigNumber) {
  if (!a) {
    return b
  }
  if (!b) {
    return a
  }

  return a?.lt(b) ? a : b
}
