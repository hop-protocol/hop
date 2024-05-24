import { utils } from 'ethers'
import { MerkleTree as MerkleTreeLib } from 'merkletreejs'
import { ChainSlug, TokenSymbol, getSubgraphUrl, rateLimitRetry } from '@hop-protocol/sdk'
import { mainnet as addresses } from '@hop-protocol/sdk/addresses'

class MerkleTree extends MerkleTreeLib {
  constructor (leaves: string[]) {
    super(leaves, utils.keccak256, {
      fillDefaultHash: () => utils.keccak256(Buffer.alloc(32))
    })
  }
}

async function makeRequest (
  chain: string,
  query: string,
  params: any = {}
) {
  return rateLimitRetry(_makeRequest)(chain, query, params)
}

async function _makeRequest (
  chain: string,
  query: string,
  params: any = {}
) {
  const url = getSubgraphUrl('mainnet', chain)
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
  const jsonRes: any = await res.json()
  if (Array.isArray(jsonRes.errors) && jsonRes.errors.length) {
    console.error('query:', query)
    throw new Error(jsonRes.errors[0].message)
  }
  return jsonRes.data
}

function normalizeEntity (x: any) {
  if (!x) {
    return x
  }

  if (x.index ) {
    x.index = Number(x.index )
  }

  if (x.destinationChainId) {
    x.destinationChainId = Number(x.destinationChainId)
  }

  if (x.timestamp) {
    x.timestamp = Number(x.timestamp)
  }

  if (x.blockNumber) {
    x.blockNumber = Number(x.blockNumber)
  }

  return x
}

export async function getTransferCommittedEventForTransferId (chain: string, token: string, transferId: string) {
  const transferRoot = await getTransferRootForTransferId(chain, token, transferId)
  if (!transferRoot) {
    return null
  }
  const transferCommitted = await getTransferCommitted(chain, token, transferRoot.rootHash)
  return transferCommitted
}

async function getTransferCommitted (chain: string, token: string, transferRootHash: string) {
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
        transactionHash
        timestamp
      }
    }
  `
  const jsonRes = await makeRequest(chain, query, {
    token,
    transferRootHash
  })
  return normalizeEntity(jsonRes.transfersCommitteds?.[0] ?? null)
}

async function getTransferRootForTransferId (chain: string, token: string, transferId: string): Promise<any> {
  let query = `
    query TransferId($token: String, $transferId: String) {
      transferSents(
        where: {
          token: $token,
          transferId: $transferId
        },
        orderBy: timestamp,
        orderDirection: desc,
        first: 1
      ) {
        id
        transferId
        destinationChainId
        transactionHash
        timestamp
      }
    }
  `
  let jsonRes = await makeRequest(chain, query, {
    token,
    transferId
  })
  const transfer = jsonRes.transferSents?.[0]
  if (!transfer) {
    throw new Error(`The transfer was not found on chain "${chain}" for ${token} transferId "${transferId}"`)
  }
  const { timestamp, destinationChainId } = transfer
  query = `
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
      }
    }
  `
  jsonRes = await makeRequest(chain, query, {
    token,
    timestamp,
    destinationChainId
  })

  const transferRoots = jsonRes.transfersCommitteds
  transfer.transferRootHash = undefined
  transfer.transferRoot = undefined
  for (const transferRoot of transferRoots) {
    const transferIds = await getTransferIdsForTransferRoot(chain, token, transferRoot.rootHash)
    const exists = transferIds.find((x: any) => x.transferId === transferId)
    if (exists) {
      return transferRoot
    }
  }
}

async function getTransferIdsForTransferRoot (
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
        destinationChainId
        timestamp
        blockNumber
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
        blockNumber
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
    startBlockNumber = (addresses?.bridges?.[token as TokenSymbol]?.[chain as ChainSlug] as any)?.bridgeDeployedBlockNumber ?? 0
  }

  const endBlockNumber = transferCommitted.blockNumber
  let lastId = '0'
  query = `
    query TransfersSent($token: String, $startBlockNumber: String, $endBlockNumber: String, $destinationChainId: String, $lastId: ID) {
      transferSents(
        where: {
          token: $token,
          blockNumber_gte: $startBlockNumber,
          blockNumber_lte: $endBlockNumber,
          destinationChainId: $destinationChainId,
          id_gt: $lastId
        },
        orderBy: id,
        orderDirection: asc,
        first: 1000,
      ) {
        id
        transferId
        destinationChainId
        index
        transactionHash
        timestamp
        blockNumber
      }
    }
  `

  const _transfers: any[] = []
  while (true) {
    jsonRes = await makeRequest(chain, query, {
      token,
      startBlockNumber: startBlockNumber.toString(),
      endBlockNumber,
      destinationChainId,
      lastId
    })
    const transferRes = jsonRes.transferSents.map((x: any) => normalizeEntity(x))

    for (const transfer of transferRes) {
      _transfers.push(transfer)
    }

    const maxItemsLength = 1000
    if (transferRes.length === maxItemsLength) {
      lastId = transferRes[transferRes.length - 1].id
    } else {
      break
    }
  }

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

type Transfer = {
  transferId: string
  blockNumber: number
  index: number
}

function getSortedTransferIds (_transfers: Transfer[], startBlockNumber: number = 0): any {
  let transfers: any[] = _transfers.sort((a: any, b: any) => {
    if (a.index > b.index) return 1
    if (a.index < b.index) return -1
    if (a.blockNumber > b.blockNumber) return 1
    if (a.blockNumber < b.blockNumber) return -1
    return 0
  })

  const seen: any = {}
  const replace: Record<string, any> = {}

  transfers = transfers.filter((x: any, i: number) => {
    if (seen[x.index]) {
      if (x.blockNumber > seen[x.index].blockNumber && x.blockNumber > startBlockNumber) {
        replace[x.index] = x
      }
      return false
    }
    seen[x.index] = x
    return true
  })

  transfers = transfers.filter((x: any, i: number) => {
    return x.index === i
  })

  const firstBlockNumber = transfers[0]?.blockNumber

  for (const i in replace) {
    const idx = i as unknown as number // note: ts type checker suggests using 'unknown' type first to fix type error
    if (idx > 100 || firstBlockNumber > transfers[idx].blockNumber) {
      transfers[idx] = replace[i]
    }
  }

  const lastIndex = transfers[transfers.length - 1]?.index
  const missingIndexes = findMissingIndexes(transfers)

  return { sortedTransfers: transfers, missingIndexes, lastIndex }
}

function findMissingIndexes (sortedTransfers: Transfer[]) {
  if (sortedTransfers?.length <= 1) {
    return []
  }

  const sortedIndexes = sortedTransfers.map((x: Transfer) => x.index)
  const last = sortedIndexes[sortedIndexes.length - 1]
  const missingIndexes = []
  for (let i = 1; i <= last; i++) {
    if (!sortedIndexes.includes(i)) {
      missingIndexes.push(i)
    }
  }

  return missingIndexes
}
