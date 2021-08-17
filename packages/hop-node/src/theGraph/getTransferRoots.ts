import makeRequest from './makeRequest'
import { normalizeEntity } from './shared'

export default async function getTransferRoots (chain: string, token: string): Promise<any[]> {
  const query = `
    query TransferRoots($token: String) {
      transfersCommitteds(
        where: {
          token: $token
        },
        orderBy: timestamp,
        orderDirection: desc,
        first: 1000
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
    token
  })
  return jsonRes.transfersCommitteds.map((x: any) => normalizeEntity(x))
}
