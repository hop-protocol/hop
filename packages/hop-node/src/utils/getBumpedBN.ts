import { BigNumber } from 'ethers'

const getBumpedBN = (value: BigNumber, multiplier: number = 1) => {
  return value.mul(BigNumber.from(multiplier * 100)).div(BigNumber.from(100))
}

export default getBumpedBN
