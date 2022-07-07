import MerkleTree from 'src/utils/MerkleTree'
import makeRequest from './makeRequest'
import { mainnet as addresses } from '@hop-protocol/core/addresses'
import { getSortedTransferIds } from 'src/utils/getSortedTransferIds'
import { normalizeEntity } from './shared'

export default async function getTransferIdsForTransferRoot (
  chain: string,
  token: string,
  rootHash: string
): Promise<string[]> {
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
  let jsonRes = await makeRequest(chain, query, {
    token,
    rootHash
  })
  const transferCommitted = jsonRes.transfersCommitteds?.[0]
  if (!transferCommitted) {
    throw new Error('transfer committed event not found for root hash')
  }

  const destinationChainId = transferCommitted.destinationChainId

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
  jsonRes = await makeRequest(chain, query, {
    token,
    blockNumber: transferCommitted.blockNumber,
    destinationChainId
  })
  const previousTransferCommitted = jsonRes.transfersCommitteds?.[0]
  let startBlockNumber: number
  if (previousTransferCommitted) {
    // get the transfer sent events between the two commit transfer events
    startBlockNumber = previousTransferCommitted.blockNumber
  } else {
    startBlockNumber = (addresses as any)?.bridges?.[token]?.[chain]?.bridgeDeployedBlockNumber ?? 0
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
  jsonRes = await makeRequest(chain, query, {
    token,
    startBlockNumber: startBlockNumber.toString(),
    endBlockNumber,
    destinationChainId
  })

  // normalize fields
  const _transfers = jsonRes.transferSents.map((x: any) => normalizeEntity(x))
  const { sortedTransfers } = getSortedTransferIds(_transfers, startBlockNumber)

  const transferIds = sortedTransfers.map((x: any) => x.transferId)

  // verify that the computed root matches the original root hash
  const tree = new MerkleTree(transferIds)
  const treeRoot = tree.getHexRoot()
  if (treeRoot !== rootHash) {
    throw new Error(`computed transfer root hash does not match; got: ${treeRoot}, expected: ${rootHash}`)
  }

  return sortedTransfers
}
