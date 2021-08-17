import makeRequest from './makeRequest'
import { normalizeEntity } from './shared'

export default async function getBondedWithdrawals (chain: string, token: string) {
  const query = `
    query WithdrawalBondeds($token: String) {
      withdrawalBondeds(
        where: {
          token: $token
        },
        orderBy: timestamp,
        orderDirection: desc,
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
    token
  })
  return jsonRes.withdrawalBondeds.map((x: any) => normalizeEntity(x))
}
