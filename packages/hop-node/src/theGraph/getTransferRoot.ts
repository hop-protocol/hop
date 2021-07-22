import getTransferIdsForTransferRoot from './getTransferIdsForTransferRoot'
import makeRequest from './makeRequest'
import { Chain } from 'src/constants'
import { chainIdToSlug, normalizeEntity } from './shared'

async function queryTransferRoot (chain: string, token: string, transferRootHash: string) {
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
  const jsonRes = await makeRequest(chain, query, {
    token,
    transferRootHash
  })
  return normalizeEntity(jsonRes.transfersCommitteds?.[0])
}

async function queryRootSet (chain: string, token: string, transferRootHash: string) {
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
  const jsonRes = await makeRequest(chain, query, {
    token,
    transferRootHash
  })
  return normalizeEntity(jsonRes.transferRootSets?.[0])
}

async function queryRootConfirmed (chain: string, token: string, transferRootHash: string) {
  const query = `
    query TransferRootConfirmed($token: String, $transferRootHash: String) {
      transferRootConfirmeds(
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
        originChainId
        destinationChainId

        transactionHash
        transactionIndex
        timestamp
        blockNumber
        contractAddress
        token
      }
    }
  `
  const jsonRes = await makeRequest(chain, query, {
    token,
    transferRootHash
  })
  return normalizeEntity(jsonRes.transferRootConfirmeds?.[0])
}

export default async function getTransferRoot (chain: string, token: string, transferRootHash: string): Promise<any> {
  const transferRoot = await queryTransferRoot(chain, token, transferRootHash)
  if (!transferRoot) {
    return transferRoot
  }
  const destinationChain = chainIdToSlug[transferRoot.destinationChainId]

  const [rootSet, rootConfirmed, transferIds] = await Promise.all([
    queryRootSet(destinationChain, token, transferRootHash),
    queryRootConfirmed(Chain.Ethereum, token, transferRootHash),
    getTransferIdsForTransferRoot(chain, token, transferRootHash)
  ])

  transferRoot.committed = true
  transferRoot.rootSet = !!rootSet
  transferRoot.rootSetEvent = rootSet
  transferRoot.rootConfirmed = !!rootConfirmed
  transferRoot.rootConfirmedEvent = rootConfirmed
  transferRoot.transferIds = transferIds

  return transferRoot
}
