import { MerkleTree as MerkleTreeLib } from 'merkletreejs'
import { utils } from 'ethers'

const { keccak256 } = utils

export class MerkleTree extends MerkleTreeLib {
  constructor (messageIds: string[]) {
    super(messageIds, keccak256)
  }

  static from (messageIds: string[]) {
    return new MerkleTree(messageIds)
  }
}
