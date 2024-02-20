import getBumpedBN from './getBumpedBN.js'
import { BigNumber } from 'ethers'

const getBumpedGasPrice = (gasPrice: BigNumber, multiplier: number) => {
  return getBumpedBN(gasPrice, multiplier)
}

export default getBumpedGasPrice
