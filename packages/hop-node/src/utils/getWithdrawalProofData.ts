import MerkleTree from 'src/utils/MerkleTree'
import { BigNumber } from 'ethers'

export interface WithdrawalProofData {
  rootTotalAmount: BigNumber
  numLeaves: number
  proof: string[]
  transferIndex: number
  leaves: string[]
}

export function getWithdrawalProofData (
  transferId: string,
  totalAmount: BigNumber,
  transferIds: string[]
): WithdrawalProofData {
  if (!transferIds?.length) {
    throw new Error('expected transfer ids')
  }

  const tree = new MerkleTree(transferIds)
  const leaves = tree.getHexLeaves()
  const numLeaves = leaves.length
  const transferIndex = leaves.indexOf(transferId)
  const proof = tree.getHexProof(leaves[transferIndex])

  return {
    rootTotalAmount: totalAmount,
    numLeaves,
    proof,
    transferIndex,
    leaves
  }
}
