import { MerkleTree as MerkleTreeLib } from 'merkletreejs';
import { utils } from 'ethers';
const { keccak256 } = utils;
export class MerkleTree extends MerkleTreeLib {
    constructor(messageIds) {
        super(messageIds, keccak256);
    }
    static from(messageIds) {
        return new MerkleTree(messageIds);
    }
}
//# sourceMappingURL=MerkleTree.js.map