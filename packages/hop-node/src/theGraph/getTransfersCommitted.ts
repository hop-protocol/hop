import makeRequest from './makeRequest.js'
import { MaxInt32 } from '#src/constants/index.js'
import { normalizeEntity } from './shared.js'

export default async function getTransfersCommitted (
  chain: string,
  token: string,
  destinationChainId: number = 0,
  startTimestamp: number = 0,
  endTimestamp: number = MaxInt32,
  lastId: string = '0'
) {
  const filters = getFilters(destinationChainId, startTimestamp, endTimestamp)
  const query = `
    query TransfersCommitted($token: String, $startTimestamp: Int, $endTimestamp: Int, $destinationChainId: Int, $lastId: ID) {
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
    destinationChainId,
    startTimestamp,
    endTimestamp,
    lastId
  })
  let transfersCommitted = jsonRes.transfersCommitteds.map((x: any) => normalizeEntity(x))

  const maxItemsLength = 1000
  if (transfersCommitted.length === maxItemsLength) {
    lastId = transfersCommitted[transfersCommitted.length - 1].id
    transfersCommitted = transfersCommitted.concat(await getTransfersCommitted(
      chain,
      token,
      destinationChainId,
      startTimestamp,
      endTimestamp,
      lastId
    ))
  }

  return transfersCommitted
}

function getFilters (
  destinationChainId: number,
  startTimestamp: number,
  endTimestamp: number
): string {
  let filters: string = `
    id_gt: $lastId
    token: $token
  `

  if (destinationChainId) {
    filters += 'destinationChainId: $destinationChainId\n'
  }

  if (startTimestamp) {
    filters += 'timestamp_gte: $startTimestamp\n'
  }

  if (endTimestamp) {
    filters += 'timestamp_lte: $endTimestamp\n'
  }

  return filters
}
