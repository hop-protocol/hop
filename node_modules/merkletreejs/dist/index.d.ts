/// <reference types="node" />
interface Options {
    /** If set to `true`, an odd node will be duplicated and combined to make a pair to generate the layer hash. */
    duplicateOdd?: boolean;
    /** If set to `true`, the leaves will hashed using the set hashing algorithms. */
    hashLeaves?: boolean;
    /** If set to `true`, constructs the Merkle Tree using the [Bitcoin Merkle Tree implementation](http://www.righto.com/2014/02/bitcoin-mining-hard-way-algorithms.html). Enable it when you need to replicate Bitcoin constructed Merkle Trees. In Bitcoin Merkle Trees, single nodes are combined with themselves, and each output hash is hashed again. */
    isBitcoinTree?: boolean;
    /** If set to `true`, the leaves will be sorted. */
    sortLeaves?: boolean;
    /** If set to `true`, the hashing pairs will be sorted. */
    sortPairs?: boolean;
    /** If set to `true`, the leaves and hashing pairs will be sorted. */
    sort?: boolean;
}
/**
 * Class reprensenting a Merkle Tree
 * @namespace MerkleTree
 */
export declare class MerkleTree {
    private duplicateOdd;
    private hashAlgo;
    private hashLeaves;
    private isBitcoinTree;
    private leaves;
    private layers;
    private sortLeaves;
    private sortPairs;
    private sort;
    /**
     * @desc Constructs a Merkle Tree.
     * All nodes and leaves are stored as Buffers.
     * Lonely leaf nodes are promoted to the next level up without being hashed again.
     * @param {Buffer[]} leaves - Array of hashed leaves. Each leaf must be a Buffer.
     * @param {Function} hashAlgorithm - Algorithm used for hashing leaves and nodes
     * @param {Object} options - Additional options
     * @example
     *```js
     *const MerkleTree = require('merkletreejs')
     *const crypto = require('crypto')
     *
     *function sha256(data) {
     *  // returns Buffer
     *  return crypto.createHash('sha256').update(data).digest()
     *}
     *
     *const leaves = ['a', 'b', 'c'].map(x => keccak(x))
     *
     *const tree = new MerkleTree(leaves, sha256)
     *```
     */
    constructor(leaves: any[], hashAlgorithm?: any, options?: Options);
    private _createHashes;
    /**
     * getLeaves
     * @desc Returns array of leaves of Merkle Tree.
     * @return {Buffer[]}
     * @example
     *```js
     *const leaves = tree.getLeaves()
     *```
     */
    getLeaves(values?: any[]): Buffer[];
    /**
     * getHexLeaves
     * @desc Returns array of leaves of Merkle Tree as hex strings.
     * @return {String[]}
     * @example
     *```js
     *const leaves = tree.getHexLeaves()
     *```
     */
    getHexLeaves(): string[];
    /**
     * getLayers
     * @desc Returns multi-dimensional array of all layers of Merkle Tree, including leaves and root.
     * @return {Buffer[]}
     * @example
     *```js
     *const layers = tree.getLayers()
     *```
     */
    getLayers(): Buffer[];
    /**
     * getHexLayers
     * @desc Returns multi-dimensional array of all layers of Merkle Tree, including leaves and root as hex strings.
     * @return {String[]}
     * @example
     *```js
     *const layers = tree.getHexLayers()
     *```
     */
    getHexLayers(): string[];
    /**
     * getLayersFlat
     * @desc Returns single flat array of all layers of Merkle Tree, including leaves and root.
     * @return {Buffer[]}
     * @example
     *```js
     *const layers = tree.getLayersFlat()
     *```
     */
    getLayersFlat(): Buffer[];
    /**
     * getHexLayersFlat
     * @desc Returns single flat array of all layers of Merkle Tree, including leaves and root as hex string.
     * @return {String[]}
     * @example
     *```js
     *const layers = tree.getHexLayersFlat()
     *```
     */
    getHexLayersFlat(): string[];
    /**
     * getRoot
     * @desc Returns the Merkle root hash as a Buffer.
     * @return {Buffer}
     * @example
     *```js
     *const root = tree.getRoot()
     *```
     */
    getRoot(): Buffer;
    /**
     * getHexRoot
     * @desc Returns the Merkle root hash as a hex string.
     * @return {String}
     * @example
     *```js
     *const root = tree.getHexRoot()
     *```
     */
    getHexRoot(): string;
    /**
     * getProof
     * @desc Returns the proof for a target leaf.
     * @param {Buffer} leaf - Target leaf
     * @param {Number} [index] - Target leaf index in leaves array.
     * Use if there are leaves containing duplicate data in order to distinguish it.
     * @return {Object[]} - Array of objects containing a position property of type string
     * with values of 'left' or 'right' and a data property of type Buffer.
     * @example
     * ```js
     *const proof = tree.getProof(leaves[2])
     *```
     *
     * @example
     *```js
     *const leaves = ['a', 'b', 'a'].map(x => keccak(x))
     *const tree = new MerkleTree(leaves, keccak)
     *const proof = tree.getProof(leaves[2], 2)
     *```
     */
    getProof(leaf: Buffer, index?: number): any[];
    /**
     * getHexProof
     * @desc Returns the proof for a target leaf as hex strings.
     * @param {Buffer} leaf - Target leaf
     * @param {Number} [index] - Target leaf index in leaves array.
     * Use if there are leaves containing duplicate data in order to distinguish it.
     * @return {String[]} - Proof array as hex strings.
     * @example
     * ```js
     *const proof = tree.getHexProof(leaves[2])
     *```
     */
    getHexProof(leaf: Buffer, index?: number): string[];
    /**
     * getProofIndices
     * @desc Returns the proof indices for given tree indices.
     * @param {Number[]} treeIndices - Tree indices
     * @param {Number} depth - Tree depth; number of layers.
     * @return {Number[]} - Proof indices
     * @example
     * ```js
     *const proofIndices = tree.getProofIndices([2,5,6], 4)
     *console.log(proofIndices) // [ 23, 20, 19, 8, 3 ]
     *```
     */
    getProofIndices(treeIndices: number[], depth: number): number[];
    /**
     * getMultiProof
     * @desc Returns the multiproof for given tree indices.
     * @param {Number[]} indices - Tree indices.
     * @return {Buffer[]} - Multiproofs
     * @example
     * ```js
     *const indices = [2, 5, 6]
     *const proof = tree.getMultiProof(indices)
     *```
     */
    getMultiProof(tree?: any[], indices?: any[]): Buffer[];
    /**
     * getHexMultiProof
     * @desc Returns the multiproof for given tree indices as hex strings.
     * @param {Number[]} indices - Tree indices.
     * @return {String[]} - Multiproofs as hex strings.
     * @example
     * ```js
     *const indices = [2, 5, 6]
     *const proof = tree.getHexMultiProof(indices)
     *```
     */
    getHexMultiProof(tree: Buffer[], indices: number[]): string[];
    /**
     * getProofFlags
     * @desc Returns list of booleans where proofs should be used instead of hashing.
     * Proof flags are used in the Solidity multiproof verifiers.
     * @param {Buffer[]} leaves
     * @param {Buffer[]} proofs
     * @return {Boolean[]} - Boolean flags
     * @example
     * ```js
     *const indices = [2, 5, 6]
     *const proof = tree.getMultiProof(indices)
     *const proofFlags = tree.getProofFlags(leaves, proof)
     *```
     */
    getProofFlags(leaves: Buffer[], proofs: Buffer[]): boolean[];
    /**
     * verify
     * @desc Returns true if the proof path (array of hashes) can connect the target node
     * to the Merkle root.
     * @param {Object[]} proof - Array of proof objects that should connect
     * target node to Merkle root.
     * @param {Buffer} targetNode - Target node Buffer
     * @param {Buffer} root - Merkle root Buffer
     * @return {Boolean}
     * @example
     *```js
     *const root = tree.getRoot()
     *const proof = tree.getProof(leaves[2])
     *const verified = tree.verify(proof, leaves[2], root)
     *```
     */
    verify(proof: any[], targetNode: Buffer, root: Buffer): boolean;
    /**
     * verifyMultiProof
     * @desc Returns true if the multiproofs can connect the leaves to the Merkle root.
     * @param {Buffer} root - Merkle tree root
     * @param {Number[]} indices - Leave indices
     * @param {Buffer[]} leaves - Leaf values at indices.
     * @param {Number} depth - Tree depth
     * @param {Buffer[]} proof - Multiproofs given indices
     * @return {Boolean}
     * @example
     *```js
     *const root = tree.getRoot()
     *const treeFlat = tree.getLayersFlat()
     *const depth = tree.getDepth()
     *const indices = [2, 5, 6]
     *const proofLeaves = indices.map(i => leaves[i])
     *const proof = tree.getMultiProof(treeFlat, indices)
     *const verified = tree.verifyMultiProof(root, indices, proofLeaves, depth, proof)
     *```
     */
    verifyMultiProof(root: Buffer, indices: number[], leaves: Buffer[], depth: number, proof: Buffer[]): boolean;
    /**
     * getDepth
     * @desc Returns the tree depth (number of layers)
     * @return {Number}
     * @example
     *```js
     *const depth = tree.getDepth()
     *```
     */
    getDepth(): number;
    /**
     * getLayersAsObject
     * @desc Returns the layers as nested objects instead of an array.
     * @example
     *```js
     *const layersObj = tree.getLayersAsObject()
     *```
     */
    getLayersAsObject(): any;
    /**
     * print
     * @desc Prints out a visual representation of the merkle tree.
     * @example
     *```js
     *tree.print()
     *```
     */
    print(): void;
    /**
     * toTreeString
     * @desc Returns a visual representation of the merkle tree as a string.
     * @return {String}
     * @example
     *```js
     *console.log(tree.toTreeString())
     *```
     */
    private _toTreeString;
    /**
     * toString
     * @desc Returns a visual representation of the merkle tree as a string.
     * @example
     *```js
     *console.log(tree.toString())
     *```
     */
    toString(): string;
    /**
     * getMultiProof
     * @desc Returns the multiproof for given tree indices.
     * @param {Buffer[]} tree - Tree as a flat array.
     * @param {Number[]} indices - Tree indices.
     * @return {Buffer[]} - Multiproofs
     *
     *@example
     * ```js
     *const flatTree = tree.getLayersFlat()
     *const indices = [2, 5, 6]
     *const proof = MerkleTree.getMultiProof(flatTree, indices)
     *```
     */
    static getMultiProof(tree: Buffer[], indices: number[]): Buffer[];
    /**
     * getPairNode
     * @desc Returns the node at the index for given layer.
     * @param {Buffer[]} layer - Tree layer
     * @param {Number} index - Index at layer.
     * @return {Buffer} - Node
     *
     *@example
     * ```js
     *const node = tree.getPairNode(layer, index)
     *```
     */
    private _getPairNode;
    /**
     * bufferIndexOf
     * @desc Returns the first index of which given buffer is found in array.
     * @param {Buffer[]} haystack - Array of buffers.
     * @param {Buffer} needle - Buffer to find.
     * @return {Number} - Index number
     *
     * @example
     * ```js
     *const index = tree.bufferIndexOf(haystack, needle)
     *```
     */
    private _bufferIndexOf;
    /**
     * bufferify
     * @desc Returns a buffer type for the given value.
     * @param {String|Number|Object|Buffer} value
     * @return {Buffer}
     *
     * @example
     * ```js
     *const buf = MerkleTree.bufferify('0x1234')
     *```
     */
    static bufferify(value: any): Buffer;
    /**
     * isHexString
     * @desc Returns true if value is a hex string.
     * @param {String} value
     * @return {Boolean}
     *
     * @example
     * ```js
     *console.log(MerkleTree.isHexString('0x1234'))
     *```
     */
    static isHexString(v: string): boolean;
    /**
     * print
     * @desc Prints out a visual representation of the given merkle tree.
     * @param {Object} tree - Merkle tree instance.
     * @return {String}
     * @example
     *```js
     *MerkleTree.print(tree)
     *```
     */
    static print(tree: any): void;
    /**
     * bufferToHex
     * @desc Returns a hex string with 0x prefix for given buffer.
     * @param {Buffer} value
     * @return {String}
     * @example
     *```js
     *const hexStr = tree.bufferToHex(Buffer.from('A'))
     *```
     */
    private _bufferToHex;
    /**
     * bufferify
     * @desc Returns a buffer type for the given value.
     * @param {String|Number|Object|Buffer} value
     * @return {Buffer}
     *
     * @example
     * ```js
     *const buf = MerkleTree.bufferify('0x1234')
     *```
     */
    private _bufferify;
    /**
     * bufferifyFn
     * @desc Returns a function that will bufferify the return value.
     * @param {Function}
     * @return {Function}
     *
     * @example
     * ```js
     *const fn = tree.bufferifyFn((value) => sha256(value))
     *```
     */
    private _bufferifyFn;
    /**
     * isHexString
     * @desc Returns true if value is a hex string.
     * @param {String} value
     * @return {Boolean}
     *
     * @example
     * ```js
     *console.log(MerkleTree.isHexString('0x1234'))
     *```
     */
    private _isHexString;
    /**
     * log2
     * @desc Returns the log2 of number.
     * @param {Number} value
     * @return {Number}
     */
    private _log2;
    /**
     * zip
     * @desc Returns true if value is a hex string.
     * @param {String[]|Number[]|Buffer[]} a - first array
     * @param {String[]|Number[]|Buffer[]} b -  second array
     * @return {String[][]|Number[][]|Buffer[][]}
     *
     * @example
     * ```js
     *const zipped = tree.zip(['a', 'b'],['A', 'B'])
     *console.log(zipped) // [ [ 'a', 'A' ], [ 'b', 'B' ] ]
     *```
     */
    private _zip;
}
export default MerkleTree;
