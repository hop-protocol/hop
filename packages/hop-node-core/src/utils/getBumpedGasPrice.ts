import { BigNumber } from 'ethers'
import { getBumpedBN } from './getBumpedBN.js'

export const getBumpedGasPrice = (gasPrice: BigNumber, multiplier: number) => {
  return getBumpedBN(gasPrice, multiplier)
}
