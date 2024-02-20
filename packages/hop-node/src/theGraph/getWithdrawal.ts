import makeRequest from './makeRequest.js'
import { normalizeEntity } from './shared.js'

export default async function getWithdrawal (chain: string, token: string, transferId: string) {
  const query = `
    query Withdrew($token: String, $transferId: String) {
      withdrews(
        where: {
          transferId: $transferId,
          token: $token
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
        from
      }
    }
  `
  const jsonRes = await makeRequest(chain, query, {
    token,
    transferId
  })

  const entity = jsonRes.withdrew?.[0]
  return normalizeEntity(entity)
}
