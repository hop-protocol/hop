import makeRequest from './makeRequest.js'
import { MaxInt32 } from '#constants/index.js'
import { normalizeEntity } from './shared.js'

export default async function getTransferFromL1Completed (
  chain: string,
  token: string,
  startDate: number = 0,
  endDate: number = MaxInt32,
  lastId: string = '0'
) {
  const query = `
    query TransferFromL1Completed(${token ? '$token: String, ' : ''}$startDate: Int, $endDate: Int, $lastId: ID) {
      transferFromL1Completeds(
        where: {
          ${token ? 'token: $token,' : ''}
          timestamp_gte: $startDate
          timestamp_lte: $endDate
          id_gt: $lastId
        },
        orderBy: id,
        orderDirection: asc,
        first: 1000
      ) {
        id
        recipient
        amount
        amountOutMin
        deadline
        relayer
        relayerFee
        transactionHash
      }
    }
  `
  const jsonRes = await makeRequest(chain, query, {
    token,
    startDate,
    endDate,
    lastId
  })
  let transfers = jsonRes.transferFromL1Completeds.map((x: any) => normalizeEntity(x))

  const maxItemsLength = 1000
  if (transfers.length === maxItemsLength) {
    lastId = transfers[transfers.length - 1].id
    transfers = transfers.concat(await getTransferFromL1Completed(
      chain,
      token,
      startDate,
      endDate,
      lastId
    ))
  }

  return transfers
}
