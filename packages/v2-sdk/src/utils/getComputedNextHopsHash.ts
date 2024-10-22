import { utils, constants, BigNumberish } from 'ethers'
import { HopStruct } from '../railsGateway/events/TransferSent.js'

export function getComputedNextHopsHash (nextHops: HopStruct[]): string {
  if (!nextHops || !Array.isArray(nextHops)) {
    throw new Error('Invalid nextHops')
  }

  if (nextHops.length === 0) return constants.HashZero

  const encodedHops = utils.defaultAbiCoder.encode(
    ['bytes32[]', 'uint256[]', 'uint256[]', 'bytes32[]'],
    [
      nextHops.map(hop => hop.pathId),
      nextHops.map(hop => hop.maxBonderFee),
      nextHops.map(hop => hop.maxTotalSent),
      nextHops.map(hop => hop.attestedClaimId)
    ]
  )

  return utils.keccak256(encodedHops)
}

// export function getComputedNextHopsHash(nextHops: HopStruct[]): string {
//   if (!nextHops || !Array.isArray(nextHops)) {
//     throw new Error('Invalid nextHops')
//   }

//   let nextHopsHash = constants.HashZero

//   // Loop through the hops in reverse order to match the Solidity logic
//   for (let i = nextHops.length - 1; i >= 0; i--) {
//     const hop = nextHops[i]

//     // Encode the current hop and combine it with the previous hash
//     const encodedHop = utils.defaultAbiCoder.encode(
//       ['bytes32', 'uint256', 'uint256', 'bytes32'],
//       [hop.pathId, hop.maxBonderFee, hop.maxTotalSent, hop.attestedClaimId]
//     )

//     nextHopsHash = utils.keccak256(utils.defaultAbiCoder.encode(['bytes', 'bytes32'], [encodedHop, nextHopsHash]))
//   }

//   return nextHopsHash
// }
