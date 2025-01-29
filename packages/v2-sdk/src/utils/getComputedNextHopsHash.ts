import { utils, constants } from 'ethers'
import { HopStruct } from '../railsGateway/events/TransferSent.js'

export function getComputedNextHopsHash(nextHops: HopStruct[]): string {
  if (!nextHops || !Array.isArray(nextHops)) {
    throw new Error('Invalid nextHops')
  }

  let nextHopsHash = constants.HashZero

  if (nextHops.length === 0) {
    return nextHopsHash
  }

  // Loop through the hops in reverse order (excluding the first one, like Solidity)
  for (let i = nextHops.length - 1; i > 0; i--) {
    const hop = nextHops[i]

    // Encode the current hop and combine it with the previous hash
    const encodedHop = utils.defaultAbiCoder.encode(
      ['bytes32', 'uint256', 'uint256', 'bytes32'],
      [hop.pathId, hop.maxBonderFee, hop.minAmountOut, hop.attestedClaimId]
    )

    nextHopsHash = utils.keccak256(utils.defaultAbiCoder.encode(['bytes', 'bytes32'], [encodedHop, nextHopsHash]))
  }

  return nextHopsHash
}
