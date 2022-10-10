import makeRequest from './makeRequest'
import { normalizeEntity } from './shared'

export default async function getTransfersCommitted (
  chain: string,
  token: string,
  startTimestamp: number = 0,
  destinationChainId: number = 0,
  lastId: string = '0'
) {
  const filters = getFilters(startTimestamp, destinationChainId)
  const query = `
    query TransfersCommitted($token: String, $startTimestamp: Int, $destinationChainId: Int, $lastId: ID) {
      transfersCommitteds(
        where: {
          ${filters}
        },
        orderBy: id,
        orderDirection: asc,
        first: 1000
      ) {
        id
        rootHash
        totalAmount
        transactionHash
        destinationChainId
        rootCommittedAt
      }
    }
  `
  const jsonRes = await makeRequest(chain, query, {
    token,
    startTimestamp,
    destinationChainId,
    lastId
  })
  let transfersCommitted = jsonRes.transfersCommitteds.map((x: any) => normalizeEntity(x))

  const maxItemsLength = 1000
  if (transfersCommitted.length === maxItemsLength) {
    lastId = transfersCommitted[transfersCommitted.length - 1].id
    transfersCommitted = transfersCommitted.concat(await getTransfersCommitted(
      chain,
      token,
      startTimestamp,
      destinationChainId,
      lastId
    ))
  }

  return transfersCommitted
}

function getFilters (startTimestamp: number, destinationChainId: number): string {
  let filters: string = `
    id_gt: $lastId
    token: $token
  `

  if (startTimestamp) {
    filters += 'timestamp_gte: $startTimestamp\n'
  }

  if (destinationChainId) {
    filters += 'destinationChainId: $destinationChainId\n'
  }

  return filters
}
