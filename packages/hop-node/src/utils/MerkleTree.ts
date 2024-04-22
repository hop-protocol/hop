import { MerkleTree as MerkleTreeLib } from 'merkletreejs'
import { utils } from 'ethers'

class MerkleTree extends MerkleTreeLib {
  constructor (leaves: string[]) {
    super(leaves, utils.keccak256, {
      fillDefaultHash: () => utils.keccak256(Buffer.alloc(32))
    })
  }
}

export default MerkleTree
