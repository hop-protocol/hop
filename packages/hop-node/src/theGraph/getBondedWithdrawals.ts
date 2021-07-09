import makeRequest from './makeRequest'

export default async function getBondedWithdrawals (chain: string) {
  const query = `
    query WithdrawalBondeds {
      withdrawalBondeds(
        orderBy: timestamp,
        orderDirection: desc
      ) {
        id
        transferId
        transactionHash
      }
    }
  `
  const jsonRes = await makeRequest(chain, query)
  return jsonRes.withdrawalBondeds
}
