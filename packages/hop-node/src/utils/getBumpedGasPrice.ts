import getBumpedBN from './getBumpedBN'
import { BigNumber } from 'ethers'

const getBumpedGasPrice = (gasPrice: BigNumber, multiplier: number) => {
  return getBumpedBN(gasPrice, multiplier)
}

export default getBumpedGasPrice
