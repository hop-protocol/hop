import makeRequest from './makeRequest'
import { DateTime } from 'luxon'
import { Filters, normalizeEntity } from './shared'
import { MaxInt32 } from 'src/constants'
import { constants } from 'ethers'

export default async function getTransferIds (
  chain: string,
  token: string,
  filters: Partial<Filters> = {},
  lastId: string = constants.AddressZero
): Promise<any[]> {
  if (chain === 'ethereum') {
    return []
  }
  const queryFilters = getFilters(token, filters.destinationChainId!)
  const query = `
    query TransfersSent(${token ? '$token: String, ' : ''}$orderDirection: String, $startDate: Int, $endDate: Int, $destinationChainId: Int, $lastId: ID) {
      transferSents(
        where: {
          ${queryFilters}
        },
        orderBy: id,
        orderDirection: asc,
        first: 1000,
      ) {
        id
        transferId
        destinationChainId
        recipient
        amount
        transferNonce
        bonderFee
        index
        amountOutMin
        deadline

        transactionHash
        transactionIndex
        timestamp
        blockNumber
        contractAddress
        token
      }
    }
  `
  const variables = {
    token,
    startDate: 0,
    endDate: MaxInt32,
    destinationChainId: 0,
    lastId
  }
  if (filters.startDate) {
    variables.startDate = DateTime.fromISO(filters.startDate).toSeconds() >>> 0
  }
  if (filters.endDate) {
    variables.endDate = DateTime.fromISO(filters.endDate).toSeconds() >>> 0
  }
  if (filters.destinationChainId) {
    variables.destinationChainId = filters.destinationChainId
  }
  const jsonRes = await makeRequest(chain, query, variables)
  let transfers = jsonRes.transferSents.map((x: any) => normalizeEntity(x))

  const maxItemsLength = 1000
  if (transfers.length === maxItemsLength) {
    lastId = transfers[transfers.length - 1].id
    transfers = transfers.concat(await getTransferIds(
      chain,
      token,
      filters,
      lastId
    ))
  }

  return transfers
}

function getFilters (token: string, destinationChainId: number): string {
  let filters: string = `
    ${token ? 'token: $token,' : ''}
    timestamp_gte: $startDate,
    timestamp_lte: $endDate,
    id_gt: $lastId
  `

  if (destinationChainId) {
    filters += 'destinationChainId: $destinationChainId\n'
  }

  return filters
}
