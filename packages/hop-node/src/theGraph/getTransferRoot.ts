import getTransferIdsForTransferRoot from './getTransferIdsForTransferRoot'
import makeRequest from './makeRequest'
import { Chain } from 'src/constants'
import { chainIdToSlug, normalizeEntity } from './shared'

async function queryTransferRoot (chain: string, transferRootHash: string) {
  const query = `
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
  const jsonRes = await makeRequest(chain, query, {
    transferRootHash
  })
  return normalizeEntity(jsonRes.transfersCommitteds?.[0])
}

async function queryRootSet (chain: string, transferRootHash: string) {
  const query = `
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
  const jsonRes = await makeRequest(chain, query, {
    transferRootHash
  })
  return normalizeEntity(jsonRes.transferRootSets?.[0])
}

async function queryRootConfirmed (chain: string, transferRootHash: string) {
  const query = `
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
  const jsonRes = await makeRequest(chain, query, {
    transferRootHash
  })
  return normalizeEntity(jsonRes.transferRootConfirmeds?.[0])
}

export default async function getTransferRoot (chain: string, transferRootHash: string): Promise<any> {
  const transferRoot = await queryTransferRoot(chain, transferRootHash)
  if (!transferRoot) {
    return transferRoot
  }
  const destinationChain = chainIdToSlug[transferRoot.destinationChainId]

  const [rootSet, rootConfirmed, transferIds] = await Promise.all([
    queryRootSet(destinationChain, transferRootHash),
    queryRootConfirmed(Chain.Ethereum, transferRootHash),
    getTransferIdsForTransferRoot(chain, transferRootHash)
  ])

  transferRoot.committed = true
  transferRoot.rootSet = !!rootSet
  transferRoot.rootSetEvent = rootSet
  transferRoot.rootConfirmedEvent = rootConfirmed
  transferRoot.transferIds = transferIds

  return transferRoot
}
