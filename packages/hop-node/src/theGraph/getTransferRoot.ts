import getTransferIdsForTransferRoot from './getTransferIdsForTransferRoot'
import makeRequest from './makeRequest'

const chainsToSlug: any = {
  1: 'ethereum',
  100: 'xdai',
  137: 'polygon'
}

function normalizeTransferRoot (x: any) {
  if (!x) {
    return x
  }
  x.destinationChainId = Number(x.destinationChainId)
  x.timestamp = Number(x.timestamp)
  x.blockNumber = Number(x.blockNumber)
  return x
}

export default async function getTransferRoot (chain: string, transferRootHash: string): Promise<any> {
  let query = `
    query TransferRoot($transferRootHash: String) {
      transfersCommitteds(
        where: {
          rootHash: $transferRootHash
        }
        orderBy: timestamp,
        orderDirection: desc,
        first: 1
      ) {
        id
        rootHash
        destinationChainId
        timestamp
        transactionHash
        blockNumber
      }
    }
  `
  let jsonRes = await makeRequest(chain, query, {
    transferRootHash
  })
  let transferRoot = jsonRes.transfersCommitteds?.[0]
  if (!transferRoot) {
    return transferRoot
  }
  transferRoot = normalizeTransferRoot(transferRoot)
  query = `
    query TransferRootSet($transferRootHash: String) {
      transferRootSets(
        where: {
          rootHash: $transferRootHash
        }
        orderBy: timestamp,
        orderDirection: desc,
        first: 1
      ) {
        id
        rootHash
        totalAmount
        timestamp
        transactionHash
        blockNumber
      }
    }
  `
  const destinationChain = chainsToSlug[transferRoot.destinationChainId]
  jsonRes = await makeRequest(destinationChain, query, {
    transferRootHash
  })
  const rootSet = jsonRes.transferRootSets?.[0]
  transferRoot.rootSet = rootSet

  query = `
    query TransferRootConfirmed($transferRootHash: String) {
      transferRootConfirmeds(
        where: {
          rootHash: $transferRootHash
        }
        orderBy: timestamp,
        orderDirection: desc,
        first: 1
      ) {
        id
        rootHash
        totalAmount
        originChainId
        destinationChainId
        timestamp
        transactionHash
        blockNumber
      }
    }
  `
  jsonRes = await makeRequest('ethereum', query, {
    transferRootHash
  })
  const rootConfirmed = jsonRes.transferRootConfirmeds?.[0]
  transferRoot.rootConfirmed = rootConfirmed

  const transferIds = await getTransferIdsForTransferRoot(chain, transferRootHash)
  transferRoot.transferIds = transferIds
  transferRoot.committed = true

  return transferRoot
}
