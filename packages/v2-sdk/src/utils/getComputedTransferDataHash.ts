import { ethers, BigNumberish } from 'ethers'
import { getComputedNextHopsHash } from './getComputedNextHopsHash.js'
import { HopStruct } from '../railsGateway/events/TransferSent.js'

interface Input {
  to: string,
  amountOut: BigNumberish,
  maxBonderFee: BigNumberish,
  totalSent: BigNumberish,
  totalClaims: BigNumberish,
  attestedClaimId: string,
  nextHops: HopStruct[]
}

export function getComputedTransferDataHash(
  { to, amountOut, maxBonderFee, totalSent, totalClaims, attestedClaimId, nextHops }: Input
): string {
  return ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(
      ['address', 'uint256', 'uint256', 'uint256', 'uint256', 'bytes32', 'bytes32'],
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
