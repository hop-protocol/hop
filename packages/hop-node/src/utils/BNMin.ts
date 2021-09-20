import { BigNumber } from 'ethers'

function BNMin (a: BigNumber, b: BigNumber) {
  return a.lt(b) ? a : b
}

export default BNMin
