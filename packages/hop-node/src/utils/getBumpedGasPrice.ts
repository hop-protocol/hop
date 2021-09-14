import { BigNumber } from 'ethers'

const getBumpedGasPrice = (gasPrice: BigNumber, multiplier: number) => {
  return gasPrice.mul(BigNumber.from(multiplier * 100)).div(BigNumber.from(100))
}

export default getBumpedGasPrice
