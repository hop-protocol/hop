"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MerkleTree = void 0;
const merkletreejs_1 = require("merkletreejs");
const ethers_1 = require("ethers");
const { keccak256 } = ethers_1.utils;
class MerkleTree extends merkletreejs_1.MerkleTree {
    constructor(messageIds) {
        super(messageIds, keccak256);
    }
    static from(messageIds) {
        return new MerkleTree(messageIds);
    }
}
exports.MerkleTree = MerkleTree;
//# sourceMappingURL=MerkleTree.js.map