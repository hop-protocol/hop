import makeRequest from './makeRequest'
import { normalizeEntity } from './shared'

export default async function getTransferRoots (chain: string, token: string, skip: number = 0): Promise<any[]> {
  const query = `
    query TransferRoots($token: String, $skip: Int) {
      transfersCommitteds(
        where: {
          token: $token
        },
        orderBy: timestamp,
        orderDirection: desc,
        skip: $skip,
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
    token,
    skip
  })

  let roots = jsonRes.transfersCommitteds.map((x: any) => normalizeEntity(x))

  if (roots.length === 1000) {
    try {
      roots = roots.concat(await getTransferRoots(
        chain,
        token,
        skip + 1000
      ))
    } catch (err) {
      if (!err.message.includes('The `skip` argument must be between')) {
        throw err
      }
    }
  }

  return roots
}
