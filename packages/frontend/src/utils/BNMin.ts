import { BigNumber } from 'ethers'

export function BNMin(a: BigNumber, b?: BigNumber) {
  if (!a) {
    return b
  }
  if (!b) {
    return a
  }

  return a?.lt(b) ? a : b
}
