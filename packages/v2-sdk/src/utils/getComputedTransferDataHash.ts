import { ethers, BigNumberish } from 'ethers'
import { getComputedNextHopsHash } from './getComputedNextHopsHash.js'
import { HopStructInput } from '../railsGateway/RailsGateway.js'

export type GetComputedTransferDataHashInput = {
  to: string,
  amount: BigNumberish
  maxBonderFee: BigNumberish
  attestedClaimId: string
  sourcePool: BigNumberish
  sourceTotalFraudulent: BigNumberish
  hops: HopStructInput[]
}

export function getComputedTransferDataHash(
  { to, amount, maxBonderFee, attestedClaimId, sourcePool, sourceTotalFraudulent, hops }: GetComputedTransferDataHashInput
): string {
  return ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(
      ['address', 'uint256', 'uint256', 'bytes32', 'uint256', 'bytes32'],
      [
        to,
        amount,
        maxBonderFee,
        attestedClaimId,
        sourcePool,
        sourceTotalFraudulent,
        getComputedNextHopsHash(hops)
      ]
    )
  )
}
