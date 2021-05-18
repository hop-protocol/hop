import { MerkleTree as MerkleTreeLib } from 'merkletreejs'
import { keccak256 } from 'ethereumjs-util'

class MerkleTree extends MerkleTreeLib {
  constructor (leaves: string[]) {
    super(leaves, keccak256, {
      fillDefaultHash: () => keccak256(Buffer.alloc(32))
    })
  }
}

export default MerkleTree
