import { ethers, BigNumberish } from 'ethers'
import { getComputedNextHopsHash } from './getComputedNextHopsHash.js'

interface HopStruct {
  pathId: string
  maxTotalSent: BigNumberish
  attestedClaimId: string
}

interface Input {
  to: string,
  amountOut: BigNumberish,
  totalSent: BigNumberish,
  totalClaims: BigNumberish,
  attestedClaimId: string,
  nextHops: HopStruct[]
}

export function getComputedTransferDataHash(
  { to, amountOut, totalSent, totalClaims, attestedClaimId, nextHops }: Input
): string {
  return ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(
      ['address', 'uint256', 'uint256', 'uint256', 'bytes32', 'bytes32'],
      [
        to,
        amountOut,
        totalSent,
        totalClaims,
        attestedClaimId,
        getComputedNextHopsHash(nextHops)
      ]
    )
  )
}
