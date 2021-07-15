import makeRequest from './makeRequest'

function normalizeEntity (x: any) {
  if (!x) {
    return x
  }
  x.timestamp = Number(x.timestamp)
  x.blockNumber = Number(x.blockNumber)
  return x
}

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
