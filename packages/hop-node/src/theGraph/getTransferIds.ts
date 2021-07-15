import makeRequest from './makeRequest'
import { normalizeEntity } from './shared'

export default async function getTransferIds (
  chain: string
): Promise<any[]> {
  const query = `
    query TransfersSent {
      transferSents(
        orderBy: blockNumber,
        orderDirection: desc,
        first: 1000,
      ) {
        id
        transferId
        destinationChainId
        transactionHash
        index
        timestamp
        blockNumber
      }
    }
  `
  const jsonRes = await makeRequest(chain, query)
  return jsonRes.transferSents.map((x: any) => normalizeEntity(x))
}
