import makeRequest from './makeRequest'
import { normalizeEntity } from './shared'

export default async function getTransferRoots (chain: string): Promise<any[]> {
  const query = `
    query TransferRoots {
      transfersCommitteds(
        orderBy: timestamp,
        orderDirection: desc,
        first: 1000
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
  const jsonRes = await makeRequest(chain, query)
  return jsonRes.transfersCommitteds.map((x: any) => normalizeEntity(x))
}
