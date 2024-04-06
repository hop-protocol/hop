import { BigNumber } from 'ethers'
import { parseUnits } from 'ethers/lib/utils.js'

export const getBumpedBN = (value: BigNumber, multiplier: number = 1) => {
  return value.mul(parseUnits(multiplier.toString(), 100)).div(parseUnits('1', 100))
}
