import makeRequest from './makeRequest'
import { MaxInt32 } from 'src/constants'
import { normalizeEntity } from './shared'

export default async function getMultipleWithdrawalsSettled (
  chain: string,
  token: string,
  startDate: number = 0,
  endDate: number = MaxInt32,
  lastId: string = '0'
) {
  const query = `
    query MultipleWithdrawalsSettled(${token ? '$token: String, ' : ''}$startDate: Int, $endDate: Int, $lastId: ID) {
      multipleWithdrawalsSettleds(
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
        rootHash
        totalBondsSettled
        bonder
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
  let withdrawalsSettled = jsonRes.multipleWithdrawalsSettleds.map((x: any) => normalizeEntity(x))

  const maxItemsLength = 1000
  if (withdrawalsSettled.length === maxItemsLength) {
    lastId = withdrawalsSettled[withdrawalsSettled.length - 1].id
    withdrawalsSettled = withdrawalsSettled.concat(await getMultipleWithdrawalsSettled(
      chain,
      token,
      startDate,
      endDate,
      lastId
    ))
  }

  return withdrawalsSettled
}
