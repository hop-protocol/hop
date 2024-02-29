import { MerkleTree as MerkleTreeLib } from 'merkletreejs'
import { keccak256 } from 'ethers/lib/utils.js'

export class MerkleTree extends MerkleTreeLib {
  constructor (messageIds: string[]) {
    super(messageIds, keccak256)
  }

  static from (messageIds: string[]) {
    return new MerkleTree(messageIds)
  }
}
