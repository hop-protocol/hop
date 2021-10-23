import makeRequest from './makeRequest'
import { DateTime } from 'luxon'
import { Filters, normalizeEntity } from './shared'
import { MaxInt32 } from 'src/constants'

export default async function getTransferIds (
  chain: string,
  token: string,
  filters: Partial<Filters> = {},
  skip: number = 0
): Promise<any[]> {
  const query = `
    query TransfersSent(${token ? '$token: String, ' : ''}$orderDirection: String, $startDate: Int, $endDate: Int, $skip: Int) {
      transferSents(
        where: {
          ${token ? 'token: $token,' : ''}
          timestamp_gte: $startDate,
          timestamp_lte: $endDate
        },
        orderBy: blockNumber,
        orderDirection: $orderDirection,
        skip: $skip,
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
    orderDirection: 'desc',
    skip
  }
  if (filters.startDate) {
    variables.startDate = DateTime.fromISO(filters.startDate).toSeconds() >>> 0
  }
  if (filters.endDate) {
    variables.endDate = DateTime.fromISO(filters.endDate).toSeconds() >>> 0
  }
  if (typeof filters.orderDesc === 'boolean') {
    variables.orderDirection = filters.orderDesc ? 'desc' : 'asc'
  }
  const jsonRes = await makeRequest(chain, query, variables)
  let transfers = jsonRes.transferSents.map((x: any) => normalizeEntity(x))

  if (transfers.length === 1000) {
    try {
      transfers = transfers.concat(await getTransferIds(
        chain,
        token,
        filters,
        skip + 1000
      ))
    } catch (err) {
      if (!err.message.includes('The `skip` argument must be between')) {
        throw err
      }
    }
  }

  return transfers
}
