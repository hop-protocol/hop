import makeRequest from './makeRequest'
import { DateTime } from 'luxon'
import { Filters, normalizeEntity } from './shared'
import { MAX_INT_32 } from 'src/constants'

export default async function getTransferIds (
  chain: string,
  token: string,
  filters: Partial<Filters> = {}
): Promise<any[]> {
  const query = `
    query TransfersSent($token: String, $orderDirection: String, $startDate: Int, $endDate: Int) {
      transferSents(
        where: {
          token: $token,
          timestamp_gte: $startDate,
          timestamp_lte: $endDate
        },
        orderBy: blockNumber,
        orderDirection: $orderDirection,
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
    endDate: MAX_INT_32,
    orderDirection: 'desc'
  }
  if (filters?.startDate) {
    variables.startDate = DateTime.fromISO(filters.startDate).toSeconds() >>> 0
  }
  if (filters?.endDate) {
    variables.endDate = DateTime.fromISO(filters.endDate).toSeconds() >>> 0
  }
  if (typeof filters?.orderDesc === 'boolean') {
    variables.orderDirection = filters.orderDesc ? 'desc' : 'asc'
  }
  const jsonRes = await makeRequest(chain, query, variables)
  return jsonRes.transferSents.map((x: any) => normalizeEntity(x))
}
