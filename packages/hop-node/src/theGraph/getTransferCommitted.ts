import makeRequest from './makeRequest'
import { normalizeEntity } from './shared'

export default async function getTransferCommitted (chain: string, token: string, transferRootHash: string) {
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