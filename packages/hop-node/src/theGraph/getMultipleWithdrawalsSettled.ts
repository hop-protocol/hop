import makeRequest from './makeRequest'
import { constants } from 'ethers'
import { normalizeEntity } from './shared'

export default async function getMultipleWithdrawalsSettled (
  chain: string,
  token: string,
  lastId: string = constants.AddressZero
) {
  const query = `
    query MultipleWithdrawalsSettled($token: String, $lastId: ID) {
      multipleWithdrawalsSettleds(
        where: {
          id_gt: $lastId
          token: $token
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
    lastId: lastId
  })
  let withdrawalsSettled = jsonRes.multipleWithdrawalsSettleds.map((x: any) => normalizeEntity(x))

  const maxItemsLength = 1000
  if (withdrawalsSettled.length === maxItemsLength) {
    lastId = withdrawalsSettled[withdrawalsSettled.length - 1].id
    withdrawalsSettled = withdrawalsSettled.concat(await getMultipleWithdrawalsSettled(
      chain,
      token,
      lastId
    ))
  }

  return withdrawalsSettled
}
