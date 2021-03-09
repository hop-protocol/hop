import { MerkleTree as MerkleTreeLib } from 'merkletreejs'
import { keccak256 } from 'ethereumjs-util'

class MerkleTree extends MerkleTreeLib {
  constructor (leaves: string[]) {
    super(leaves, keccak256)
  }
}

export default MerkleTree
