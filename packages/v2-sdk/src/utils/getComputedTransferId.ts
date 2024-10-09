import { ethers } from 'ethers'

export function getComputedTransferId(
  previousTransferId: string,
  transferDataHash: string
): string {
  if (previousTransferId.length !== 66 || transferDataHash.length !== 66) {
    throw new Error("Input should be a 32-byte hex string (bytes32)")
  }

  const transferId = ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(
      ['bytes32', 'bytes32'],
      [previousTransferId, transferDataHash]
    )
  )

  return transferId
}
