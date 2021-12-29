import { BigNumber } from 'ethers'

export function shiftBNDecimals(bn: BigNumber, shiftAmount: number): BigNumber {
  if (shiftAmount < 0) throw new Error('shiftAmount must be positive')
  return bn.mul(BigNumber.from(10).pow(shiftAmount))
}
