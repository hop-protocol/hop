import { ethers, BigNumberish } from 'ethers'
import { getComputedNextHopsHash } from './getComputedNextHopsHash.js'
import { HopStruct } from '../railsGateway/events/TransferSent.js'

export type GetComputedTransferDataHashInput = {
  to: string,
  amountOut: BigNumberish,
  maxBonderFee: BigNumberish,
  attestedClaimId: string,
  totalSent: BigNumberish,
  totalClaims: BigNumberish,
  nextHops: HopStruct[]
}

export function getComputedTransferDataHash(
  { to, amountOut, maxBonderFee, totalSent, totalClaims, attestedClaimId, nextHops }: GetComputedTransferDataHashInput
): string {
  return ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(
      ['address', 'uint256', 'uint256', 'bytes32', 'uint256', 'uint256', 'bytes32'],
      [
        to,
        amountOut,
        maxBonderFee,
        attestedClaimId,
        totalSent,
        totalClaims,
        getComputedNextHopsHash(nextHops)
      ]
    )
  )
}
