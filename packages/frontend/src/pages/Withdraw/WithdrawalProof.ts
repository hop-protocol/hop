import { MerkleTree as MerkleTreeLib } from 'merkletreejs'
import { keccak256 } from 'ethereumjs-util'

function chainIdToSlug(id) {
  return {
    1: 'ethereum',
    10: 'optimism',
    100: 'xdai',
    137: 'polygon',
  }[id]
}

class MerkleTree extends MerkleTreeLib {
  constructor (leaves) {
    super(leaves, keccak256, {
      fillDefaultHash: () => keccak256(Buffer.alloc(32))
    })
  }
}

export class WithdrawalProof {
  transferId:any
  transferRootHash :any
  leaves :any
  proof :any
  transferIndex :any
  rootTotalAmount :any
  numLeaves :any
  transfer : any
  transferRoot :any

  constructor(transferId) {
    this.transferId = transferId
  }

  async generateProof() {
    const {
      transferId,
      transferRootHash,
      leaves,
      proof,
      transferIndex,
      rootTotalAmount,
      numLeaves,
      transfer,
      transferRoot
    } = await this.generateProofForTransferId(this.transferId)

    this.transferRootHash = transferRootHash
    this.leaves = leaves
    this.proof = proof
    this.transferIndex = transferIndex
    this.rootTotalAmount = rootTotalAmount
    this.numLeaves = numLeaves
    this.transfer = transfer
    this.transferRoot = transferRoot
    return proof
  }

  getProofPayload() {
    const { proof, transferIndex, rootTotalAmount, numLeaves, transferId, transferRootHash, leaves } = this

    return {
      transferId,
      transferRootHash,
      leaves,
      proof,
      transferIndex,
      rootTotalAmount,
      numLeaves,
    }
  }

  getTxPayload() {
    const { recipient, amount, transferNonce, bonderFee, amountOutMin, deadline } = this.transfer
    const { transferRootHash, rootTotalAmount, transferIndex, proof, numLeaves } = this

    return {
      recipient,
      amount,
      transferNonce,
      bonderFee,
      amountOutMin,
      deadline,
      transferRootHash,
      rootTotalAmount,
      transferIdTreeIndex: transferIndex,
      siblings: proof,
      totalLeaves: numLeaves
    }
  }

  async generateProofForTransferId(transferId) {
    const transfer = await this.getTransfer(transferId)
    if (!transfer) {
      throw new Error('transfer not found')
    }
    const { destinationChain, recipient, amount, transferNonce, bonderFee, amountOutMin, deadline } = transfer

    const transferRoot = await this.getTransferRootForTransferId(transfer)
    if (!transferRoot) {
      throw new Error('transfer root not found for transfer id')
    }
    const { rootHash: transferRootHash, totalAmount: rootTotalAmount } = transferRoot
    const transferIds = transferRoot.transferIds.map((x) => x.transferId)
    if (!transferIds.length) {
      throw new Error('transfer ids not found for transfer root')
    }
    const {
      numLeaves,
      proof,
      transferIndex,
      leaves
    } = this.getWithdrawalProofData(
      transferId,
      rootTotalAmount,
      transferIds
    )

    const result = {
      transferId,
      transferRootHash,
      leaves,
      proof,
      transferIndex,
      rootTotalAmount,
      numLeaves,
      transfer,
      transferRoot
    }

    return result
  }

  getWithdrawalProofData (
    transferId,
    rootTotalAmount,
    transferIds
  ) {
    if (!transferIds.length) {
      throw new Error('expected transfer ids for transfer root hash')
    }
    const tree = new MerkleTree(transferIds)
    const leaves = tree.getHexLeaves()
    const numLeaves = leaves.length
    const transferIndex = leaves.indexOf(transferId)
    if (!leaves[transferIndex]) {
      throw new Error('leaf not found')
    }
    const proof = tree.getHexProof(leaves[transferIndex])

    return {
      rootTotalAmount,
      numLeaves,
      proof,
      transferIndex,
      leaves
    }
  }

  async makeRequest (
    chain,
    query,
    params = {}
  ) {
    const url = this.getUrl(chain)
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        query,
        variables: params
      })
    })
    const jsonRes = await res.json()
    if (Array.isArray(jsonRes.errors) && jsonRes.errors.length) {
      throw new Error(jsonRes.errors[0].message)
    }
    return jsonRes.data
  }

  getUrl(chain: string) {
    let url = 'https://api.thegraph.com/subgraphs/name/hop-protocol/hop'
    if (chain === 'gnosis') {
      chain = 'xdai'
    }
    if (chain === 'ethereum') {
      url = `${url}-mainnet`
    } else {
      url = `${url}-${chain}`
    }
    return url
  }

  async getTransfer (transferId) {
    const chains = ['polygon', 'xdai', 'arbitrum', 'optimism']
    for (const chain of chains) {
      const transfer = await this.getTransferFromChain(transferId, chain)
      if (transfer) {
        const sourceChain = chain
        const destinationChain = chainIdToSlug(transfer.destinationChainId)
        return { ...transfer, sourceChain, destinationChain }
      }
    }
    return null
  }

  async getTransferFromChain (transferId, chain) {
    const query = `
      query TransferId($transferId: String) {
        transferSents(
          where: {
            transferId: $transferId
          },
          orderBy: timestamp,
          orderDirection: desc,
          first: 1
        ) {
          id
          transferId
          destinationChainId
          recipient
          amount
          transferNonce
          bonderFee
          index
          amountOutMin
          deadline

          transactionHash
          transactionIndex
          timestamp
          blockNumber
          contractAddress
          token
        }
      }
    `
    const jsonRes = await this.makeRequest(chain, query, {
      transferId
    })

    if (!jsonRes.transferSents) {
      throw new Error('transfer not found')
    }

    const transfer = jsonRes.transferSents[0]
    if (!transfer) {
      return null
    }

    return transfer
  }

  async getTransferRootForTransferId (transfer) {
    const { transferId, timestamp, destinationChainId, sourceChain, token } = transfer
    const query = `
      query TransferCommitted($token: String, $timestamp: String, $destinationChainId: String) {
        transfersCommitteds(
          where: {
            token: $token,
            timestamp_gte: $timestamp,
            destinationChainId: $destinationChainId
          },
          orderBy: timestamp,
          orderDirection: asc,
          first: 10
        ) {
          id
          rootHash
          destinationChainId
          totalAmount
          rootCommittedAt

          transactionHash
          transactionIndex
          timestamp
          blockNumber
          contractAddress
          token
        }
      }
    `
    const jsonRes = await this.makeRequest(sourceChain, query, {
      token,
      timestamp,
      destinationChainId
    })

    const transferRoots = jsonRes.transfersCommitteds
    for (const transferRoot of transferRoots) {
      const transferIds = await this.getTransferIdsForTransferRoot(sourceChain, token, transferRoot.rootHash)
      const exists = transferIds.find((x) => x.transferId === transferId)
      if (exists) {
        // get complete object
        return this.getTransferRoot(sourceChain, token, transferRoot.rootHash)
      }
    }
    return null
  }

  async getTransferIdsForTransferRoot (chain, token, rootHash) {
    // get commit transfer event of root hash
    let query = `
      query TransferCommitteds($token: String, $rootHash: String) {
        transfersCommitteds(
          where: {
            token: $token,
            rootHash: $rootHash
          },
          orderBy: timestamp,
          orderDirection: asc,
          first: 1
        ) {
          id
          rootHash
          destinationChainId
          totalAmount
          rootCommittedAt

          transactionHash
          transactionIndex
          timestamp
          blockNumber
          contractAddress
          token
        }
      }
    `
    let jsonRes = await this.makeRequest(chain, query, {
      token,
      rootHash
    })
    const transferCommitted = jsonRes.transfersCommitteds[0]
    if (!transferCommitted) {
      throw new Error('transfer committed event not found for root hash')
    }

    const { destinationChainId } = transferCommitted

    // get the previous commit transfer event
    query = `
      query TransferCommitteds($token: String, $blockNumber: String, $destinationChainId: String) {
        transfersCommitteds(
          where: {
            token: $token,
            blockNumber_lt: $blockNumber,
            destinationChainId: $destinationChainId,
          },
          orderBy: blockNumber,
          orderDirection: desc,
          first: 1,
        ) {
          id
          rootHash
          destinationChainId
          totalAmount
          rootCommittedAt

          transactionHash
          transactionIndex
          timestamp
          blockNumber
          contractAddress
          token
        }
      }
    `
    jsonRes = await this.makeRequest(chain, query, {
      token,
      blockNumber: transferCommitted.blockNumber,
      destinationChainId
    })
    const previousTransferCommitted = jsonRes.transfersCommitteds[0]
    let startBlockNumber
    if (previousTransferCommitted) {
      // get the transfer sent events between the two commit transfer events
      startBlockNumber = previousTransferCommitted.blockNumber
    } else {
      throw new Error('previous transfer committed not found. use bridgeDeployedBlockNumber as start block number')
    }

    const endBlockNumber = transferCommitted.blockNumber
    query = `
      query TransfersSent($token: String, $startBlockNumber: String, $endBlockNumber: String, $destinationChainId: String) {
        transferSents(
          where: {
            token: $token,
            blockNumber_gte: $startBlockNumber,
            blockNumber_lte: $endBlockNumber,
            destinationChainId: $destinationChainId
          },
          orderBy: blockNumber,
          orderDirection: asc,
          first: 1000,
        ) {
          id
          transferId
          destinationChainId
          recipient
          amount
          transferNonce
          bonderFee
          index
          amountOutMin
          deadline

          transactionHash
          transactionIndex
          timestamp
          blockNumber
          contractAddress
          token
        }
      }
    `
    jsonRes = await this.makeRequest(chain, query, {
      token,
      startBlockNumber: startBlockNumber.toString(),
      endBlockNumber,
      destinationChainId
    })

    // normalize fields
    let transferIds = jsonRes.transferSents.map((x) => this.normalizeEntity(x))

    // sort by transfer id block number and index
    transferIds = transferIds.sort((a, b) => {
      if (a.index > b.index) return 1
      if (a.index < b.index) return -1
      if (a.blockNumber > b.blockNumber) return 1
      if (a.blockNumber < b.blockNumber) return -1
      return 0
    })

    const seen = {}

    // remove any transfer id after a second index of 0,
    // which occurs if commit transfers is triggered on a transfer sent
    transferIds = transferIds.filter((x, i) => {
      if (seen[x.index]) {
        return false
      }
      seen[x.index] = true
      return true
    })
      .filter((x, i) => {
      // filter out any transfers ids after sequence breaks
        return x.index === i
      })

    // filter only transfer ids for leaves
    const leaves = transferIds.map((x) => {
      return x.transferId
    })

    // verify that the computed root matches the original root hash
    const tree = new MerkleTree(leaves)
    if (tree.getHexRoot() !== rootHash) {
      throw new Error('computed transfer root hash does not match')
    }

    return transferIds
  }

  async queryTransferRoot (chain, token, transferRootHash) {
    const query = `
      query TransferRoot($token: String, $transferRootHash: String) {
        transfersCommitteds(
          where: {
            token: $token,
            rootHash: $transferRootHash
          }
          orderBy: timestamp,
          orderDirection: desc,
          first: 1
        ) {
          id
          rootHash
          destinationChainId
          totalAmount
          rootCommittedAt

          transactionHash
          transactionIndex
          timestamp
          blockNumber
          contractAddress
          token
        }
      }
    `
    const jsonRes = await this.makeRequest(chain, query, {
      token,
      transferRootHash
    })
    return this.normalizeEntity(jsonRes.transfersCommitteds[0])
  }

  async queryRootSet (chain, token, transferRootHash) {
    const query = `
      query TransferRootSet($token: String, $transferRootHash: String) {
        transferRootSets(
          where: {
            token: $token,
            rootHash: $transferRootHash
          }
          orderBy: timestamp,
          orderDirection: desc,
          first: 1
        ) {
          id
          rootHash
          totalAmount

          transactionHash
          transactionIndex
          timestamp
          blockNumber
          contractAddress
          token
        }
      }
    `
    const jsonRes = await this.makeRequest(chain, query, {
      token,
      transferRootHash
    })
    return this.normalizeEntity(jsonRes.transferRootSets[0])
  }

  async getTransferRoot (chain, token, transferRootHash) {
    const transferRoot = await this.queryTransferRoot(chain, token, transferRootHash)
    if (!transferRoot) {
      return transferRoot
    }
    const destinationChain = chainIdToSlug(transferRoot.destinationChainId)

    const [rootSet, transferIds] = await Promise.all([
      this.queryRootSet(destinationChain, token, transferRootHash),
      this.getTransferIdsForTransferRoot(chain, token, transferRootHash)
    ])

    transferRoot.committed = true
    transferRoot.rootSet = !!rootSet
    transferRoot.numTransfers = transferIds.length
    transferRoot.transferIds = transferIds

    return transferRoot
  }

  normalizeEntity (x) {
    if (!x) {
      return x
    }

    if (x.index !== undefined) {
      x.index = Number(x.index)
    }

    if (x.sourceChainId) {
      x.sourceChainId = Number(x.sourceChainId)
      x.sourceChain = chainIdToSlug(x.sourceChainId)
    }

    if (x.destinationChainId) {
      x.destinationChainId = Number(x.destinationChainId)
      x.destinationChain = chainIdToSlug(x.destinationChainId)
    }

    x.blockNumber = Number(x.blockNumber)
    x.timestamp = Number(x.timestamp)

    return x
  }

  get rootSet () {
    return this.transferRoot.rootSet
  }
}

