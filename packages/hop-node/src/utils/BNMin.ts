import { BigNumber } from 'ethers'

function bnMin (a: BigNumber, b: BigNumber) {
  if (!a) {
    return b
  }
  if (!b) {
    return a
  }
  return a?.lt(b) ? a : b
}

export default bnMin
