import { utils } from 'ethers'
import type { BigNumber } from 'ethers'

export const getBumpedBN = (value: BigNumber, multiplier: number = 1) => {
  return value.mul(utils.parseUnits(multiplier.toString(), 100)).div(utils.parseUnits('1', 100))
}
