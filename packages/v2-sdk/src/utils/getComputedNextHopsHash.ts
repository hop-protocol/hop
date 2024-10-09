import { utils, constants, BigNumberish } from 'ethers'

interface HopStruct {
  pathId: string
  maxTotalSent: BigNumberish
  attestedClaimId: string
}

export function getComputedNextHopsHash (nextHops: HopStruct[]): string {
  if (!nextHops || !Array.isArray(nextHops)) {
    throw new Error('Invalid nextHops')
  }

  if (nextHops.length === 0) return constants.HashZero

  const encodedHops = utils.defaultAbiCoder.encode(
    ['bytes32[]', 'uint256[]', 'bytes32[]'],
    [
      nextHops.map(hop => hop.pathId),
      nextHops.map(hop => hop.maxTotalSent),
      nextHops.map(hop => hop.attestedClaimId)
    ]
  )

  return utils.keccak256(encodedHops)
}
