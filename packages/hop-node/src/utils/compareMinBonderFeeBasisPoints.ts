import { BigNumber } from 'ethers'
import { BonderFeeBps, Chain, MinBonderFeeAbsolute } from 'src/constants'
import { BonderFeeTooLowError } from 'src/types/error'

async function compareMinBonderFeeBasisPoints (
  amountIn: BigNumber,
  bonderFee: BigNumber,
  destinationChain: string
) {
  if (amountIn.eq(0)) {
    return
  }
  // There is no concept of a minBonderFeeAbsolute on the L1 bridge so we default to 0 since the
  // relative fee will negate this value anyway
  let bonderFeeBps = BonderFeeBps.L2ToL1
  if (destinationChain !== Chain.Ethereum) {
    bonderFeeBps = BonderFeeBps.L2ToL2
  }

  let minBonderFeeRelative = amountIn.mul(bonderFeeBps).div(10000)

  // add 10% buffer for in the case amountIn is greater than originally
  // estimated in frontend due to user receiving more hTokens during swap
  const tolerance = 0.10
  minBonderFeeRelative = minBonderFeeRelative.sub(minBonderFeeRelative.mul(tolerance * 100).div(100))
  const minBonderFee = minBonderFeeRelative.gt(MinBonderFeeAbsolute)
    ? minBonderFeeRelative
    : MinBonderFeeAbsolute
  const isTooLow = bonderFee.lt(minBonderFee)
  if (isTooLow) {
    throw new BonderFeeTooLowError(`bonder fee is too low. Cannot bond withdrawal. bonderFee: ${bonderFee}, minBonderFee: ${minBonderFee}`)
  }
}

export default compareMinBonderFeeBasisPoints
