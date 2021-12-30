import { BigNumber } from 'ethers'

export function getBonderFeeWithId(bonderFee: BigNumber, modifyAmount: string = '123'): BigNumber {
  const modifyAmountLength = modifyAmount.length
  if (bonderFee.toString().length <= modifyAmountLength) {
    return bonderFee
  }

  const feeStr: string = bonderFee.toString()
  const modifiedFee: string = feeStr.substring(0, feeStr.length - modifyAmountLength) + modifyAmount
  return BigNumber.from(modifiedFee)
}
