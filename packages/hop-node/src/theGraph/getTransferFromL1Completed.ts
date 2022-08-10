import makeRequest from './makeRequest'
import { MaxInt32 } from 'src/constants'
import { constants } from 'ethers'
import { normalizeEntity } from './shared'

export default async function getTransferFromL1Completed (
  chain: string,
  token: string,
  startDate: number = 0,
  endDate: number = MaxInt32,
  lastId: string = constants.AddressZero
) {
  const query = `
    query TransferFromL1Completeds(${token ? '$token: String, ' : ''}$startDate: Int, $endDate: Int, $lastId: ID) {
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
      }
    }
  `
  const jsonRes = await makeRequest(chain, query, {
    token,
    startDate,
    endDate,
    lastId: lastId
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
