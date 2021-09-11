import { BigNumber } from 'ethers'

function BNMax (a: BigNumber, b: BigNumber) {
  return a.gt(b) ? a : b
}

export default BNMax
