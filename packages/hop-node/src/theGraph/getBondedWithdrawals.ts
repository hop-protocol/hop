import makeRequest from './makeRequest'
import { normalizeEntity } from './shared'

export default async function getBondedWithdrawals (chain: string) {
  const query = `
    query WithdrawalBondeds {
      withdrawalBondeds(
        orderBy: timestamp,
        orderDirection: desc
      ) {
        id
        transferId
        timestamp
        blockNumber
        transactionHash
      }
    }
  `
  const jsonRes = await makeRequest(chain, query)
  return jsonRes.withdrawalBondeds.map((x: any) => normalizeEntity(x))
}
