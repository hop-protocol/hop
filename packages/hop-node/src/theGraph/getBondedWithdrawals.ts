import makeRequest from './makeRequest'
import { normalizeEntity } from './shared'

export default async function getBondedWithdrawals (
  chain: string,
  token: string,
  lastId: string = '0x0000000000000000000000000000000000000000'
) {
  const query = `
    query WithdrawalBonded($token: String, $lastId: ID) {
      withdrawalBondeds(
        where: {
          token: $token,
          id_gt: $lastId
        },
        orderBy: id,
        orderDirection: asc,
        first: 1000
      ) {
        id
        transferId
        amount

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
    lastId
  })
  let withdrawals = jsonRes.withdrawalBondeds.map((x: any) => normalizeEntity(x))

  const maxItemsLength = 1000
  if (withdrawals.length === maxItemsLength) {
    lastId = withdrawals[withdrawals.length - 1].id
    withdrawals = withdrawals.concat(await getBondedWithdrawals(
      chain,
      token,
      lastId
    ))
  }

  return withdrawals
}
