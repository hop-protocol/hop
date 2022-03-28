import { MerkleTree as MerkleTreeLib } from 'merkletreejs'
import { keccak256 } from 'ethereumjs-util'
import { networkIdToSlug } from 'src/utils/networks'
import { getTokenDecimals } from 'src/utils/tokens'
import { getUrl } from 'src/utils/queries'

class MerkleTree extends MerkleTreeLib {
  constructor (leaves: string[]) {
    super(leaves, keccak256, {
      fillDefaultHash: () => keccak256(Buffer.alloc(32))
    })
  }
}

type Transfer = any
type TransferRoot = any

export class WithdrawalProof {
  transferId: string
  transferRootHash?:string
  leaves?:string[]
  proof?:string[]
  transferIndex?:number
  rootTotalAmount?:string
  numLeaves?:number
  transfer?: Transfer
  transferRoot ?: TransferRoot

  constructor(transferId) {
    if (!transferId) {
      throw new Error('Transfer ID is required')
    }

    if (typeof transferId !== 'string') {
      throw new Error('Transfer ID must be a hex string')
    }

    if (!transferId.startsWith('0x')) {
      throw new Error('Transfer ID must be a hex string starting with 0x')
    }

    this.transferId = transferId
  }

  public async generateProof() {
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

  public getProofPayload() {
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

  public getTxPayload() {
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

  public checkWithdrawable() {
    if (!this.transfer) {
      throw new Error('Transfer ID not found')
    }
    if (!this.transferRoot) {
      throw new Error('transfer root not found')
    }
    const { rootSet } = this.transferRoot
    const { withdrawn, bonded } = this.transfer
    if (withdrawn) {
      throw new Error('Transfer has already been withdrawn')
    }
    if (bonded) {
      throw new Error('Transfer has already been bonded. Cannot withdraw a bonded transfer.')
    }
    if (!rootSet) {
      throw new Error('Transfer root has not been set yet. Try again in a few hours')
    }
  }

  private async generateProofForTransferId(transferIdOrTxHash: string) {
    const transfer = await this.findTransfer(transferIdOrTxHash)
    if (!transfer) {
      throw new Error('Transfer ID not found')
    }
    this.transferId = transfer.transferId
    const transferId = this.transferId
    const { destinationChain, recipient, amount, transferNonce, bonderFee, amountOutMin, deadline } = transfer

    const transferRoot = await this.getTransferRootForTransferId(transfer)
    if (!transferRoot) {
      throw new Error('Transfer root not found for transfer ID. Transfer root has not been committed yet. Withdrawal can only occur after the transfer root has been set at the destination. This may take a few hours or days.')
    }
    const { rootHash: transferRootHash, totalAmount: rootTotalAmount } = transferRoot
    const transferIds = transferRoot.transferIds.map((x:Transfer) => x.transferId)
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

  private getWithdrawalProofData (
    transferId: string,
    rootTotalAmount: string,
    transferIds: string[]
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

  private async makeRequest (
    chain: string,
    query: string,
    params: any = {}
  ) {
    const url = getUrl(chain)
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

  private async findTransfer (transferId: string) {
    const chains = ['polygon', 'xdai', 'arbitrum', 'optimism']
    let transfer : Transfer
    for (const chain of chains) {
      transfer = await this.queryTransfer(transferId, chain)
      if (transfer) {
        break
      }
    }

    if (!transfer) {
      for (const chain of chains) {
        transfer = await this.queryTransferByTransactionHash(transferId, chain)
        if (transfer) {
          break
        }
      }
    }

    if (transfer) {
      const { transferId, destinationChainId, token } = transfer
      const destinationChain = networkIdToSlug(destinationChainId)
      const [withdrewEvent, bondedEvent] = await Promise.all([
        this.queryWithdrew(transferId, destinationChain),
        this.queryBondWithdrawal(transferId, destinationChain)
      ])
      const tokenDecimals = getTokenDecimals(token)
      const withdrawn = !!withdrewEvent
      const bonded = !!bondedEvent
      return { ...transfer, destinationChain, tokenDecimals, withdrawn, bonded }
    }
    return null
  }

  private async queryTransfer(transferId: string, chain: string) {
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
      throw new Error('Transfer ID not found')
    }

    const transfer = jsonRes.transferSents[0]
    if (!transfer) {
      return null
    }

    transfer.sourceChain = chain
    return this.normalizeEntity(transfer)
  }

  private async queryTransferByTransactionHash(transactionHash: string, chain: string) {
    const query = `
      query TransferId($transactionHash: String) {
        transferSents(
          where: {
            transactionHash: $transactionHash
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
      transactionHash
    })

    if (!jsonRes.transferSents) {
      throw new Error('Transfer ID not found')
    }

    const transfer = jsonRes.transferSents[0]
    if (!transfer) {
      return null
    }

    transfer.sourceChain = chain
    return this.normalizeEntity(transfer)
  }

  private async queryWithdrew (transferId: string, chain: string) {
    const query = `
      query Withdrew($transferId: String) {
        withdrews(
          where: {
            transferId: $transferId
          },
          orderBy: timestamp,
          orderDirection: desc,
          first: 1
        ) {
          id
          transferId
          amount

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

    if (!jsonRes.withdrews) {
      return null
    }

    const event = jsonRes.withdrews[0]
    if (!event) {
      return null
    }

    return event
  }

  private async queryBondWithdrawal(transferId: string, chain: string) {
    const query = `
      query WithdrawalBonded($transferId: String) {
        withdrawalBondeds(
          where: {
            transferId: $transferId
          },
          orderBy: timestamp,
          orderDirection: desc,
          first: 1
        ) {
          id
          transferId
          amount

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

    const entity = jsonRes.withdrawalBondeds[0]
    return this.normalizeEntity(entity)
  }

  private async getTransferRootForTransferId (transfer: Transfer) {
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
      timestamp: timestamp.toString(),
      destinationChainId: destinationChainId.toString()
    })

    const transferRoots = jsonRes.transfersCommitteds
    for (const transferRoot of transferRoots) {
      const transferIds = await this.queryTransferIdsForTransferRoot(sourceChain, token, transferRoot.rootHash)
      const exists = transferIds.find((x) => x.transferId === transferId)
      if (exists) {
        // get complete object
        return this.getTransferRoot(sourceChain, token, transferRoot.rootHash)
      }
    }
    return null
  }

  private async queryTransferIdsForTransferRoot (chain: string, token: string, rootHash: string) {
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
    let transferIds = jsonRes.transferSents.map((x: Transfer) => this.normalizeEntity(x))

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
    const leaves = transferIds.map((x: Transfer) => {
      return x.transferId
    })

    // verify that the computed root matches the original root hash
    const tree = new MerkleTree(leaves)
    if (tree.getHexRoot() !== rootHash) {
      throw new Error('computed transfer root hash does not match')
    }

    return transferIds
  }

  private async queryTransferRoot (chain: string, token: string, transferRootHash: string) {
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

  private async queryRootSet (chain: string, token: string, transferRootHash: string) {
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

  private async getTransferRoot (chain: string, token: string, transferRootHash: string) {
    const transferRoot = await this.queryTransferRoot(chain, token, transferRootHash)
    if (!transferRoot) {
      return transferRoot
    }
    const destinationChain = networkIdToSlug(transferRoot.destinationChainId)

    const [rootSet, transferIds] = await Promise.all([
      this.queryRootSet(destinationChain, token, transferRootHash),
      this.queryTransferIdsForTransferRoot(chain, token, transferRootHash)
    ])

    transferRoot.committed = true
    transferRoot.rootSet = !!rootSet
    transferRoot.numTransfers = transferIds.length
    transferRoot.transferIds = transferIds

    return transferRoot
  }

  private normalizeEntity (x: any) {
    if (!x) {
      return x
    }

    if (x.index !== undefined) {
      x.index = Number(x.index)
    }

    if (x.sourceChainId) {
      x.sourceChainId = Number(x.sourceChainId)
      x.sourceChain = networkIdToSlug(x.sourceChainId)
    }

    if (x.destinationChainId) {
      x.destinationChainId = Number(x.destinationChainId)
      x.destinationChain = networkIdToSlug(x.destinationChainId)
    }

    x.blockNumber = Number(x.blockNumber)
    x.timestamp = Number(x.timestamp)

    return x
  }
}

