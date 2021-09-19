import { BigNumber } from 'ethers'

function modifyBonderFee (bonderFee: BigNumber, modifyAmount: number): BigNumber {
  const feeStr: string = bonderFee.toString()
  const modifiedFee: string = feeStr.substring(0, feeStr.length - 1) + modifyAmount.toString()
  return BigNumber.from(modifiedFee)
}

export default modifyBonderFee
