import makeRequest from './makeRequest'
import { normalizeEntity } from './shared'

export default async function getBondedWithdrawal (chain: string, transferId: string) {
  const query = `
    query WithdrawalBonded($transferId: String) {
      withdrawalBondeds(
        where: {
          transferId: $transferId
        },
        orderBy: timestamp,
        orderDirection: desc,
        first: 1
      ) {
        id
        transferId
        timestamp
        blockNumber
        transactionHash
      }
    }
  `
  const jsonRes = await makeRequest(chain, query, {
    transferId
  })

  const entity = jsonRes.withdrawalBondeds?.[0]
  return normalizeEntity(entity)
}
