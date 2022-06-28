import MerkleTree from 'src/utils/MerkleTree'
import makeRequest from './makeRequest'
import { mainnet as addresses } from '@hop-protocol/core/addresses'
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
  let transferIds = jsonRes.transferSents.map((x: any) => normalizeEntity(x))

  // sort by transfer id block number and index
  transferIds = transferIds.sort((a: any, b: any) => {
    if (a.index > b.index) return 1
    if (a.index < b.index) return -1
    if (a.blockNumber > b.blockNumber) return 1
    if (a.blockNumber < b.blockNumber) return -1
    return 0
  })

  const seen: any = {}
  const replace: any = {}

  // remove any transfer id after a second index of 0,
  // which occurs if commit transfers is triggered on a transfer sent
  transferIds = transferIds.filter((x: any, i: number) => {
    if (seen[x.index]) {
      if (x.index > 100 && x.blockNumber > seen[x.index].blockNumber && x.blockNumber > startBlockNumber) {
        replace[x.index] = x
      }
      return false
    }
    seen[x.index] = x
    return true
  })

  transferIds = transferIds.filter((x: any, i: number) => {
    // filter out any transfers ids after sequence breaks
    return x.index === i
  })

  for (const i in replace) {
    transferIds[i] = replace[i]
  }

  // filter only transfer ids for leaves
  const leaves = transferIds.map((x: any) => {
    return x.transferId
  })

  // verify that the computed root matches the original root hash
  const tree = new MerkleTree(leaves)
  const treeRoot = tree.getHexRoot()
  if (treeRoot !== rootHash) {
    throw new Error(`computed transfer root hash does not match; got: ${treeRoot}, expected: ${rootHash}`)
  }

  return transferIds
}
