import { getBumpedBN } from './getBumpedBN.js'
import type { BigNumber } from 'ethers'

export const getBumpedGasPrice = (gasPrice: BigNumber, multiplier: number) => {
  return getBumpedBN(gasPrice, multiplier)
}
