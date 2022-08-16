import makeRequest from './makeRequest'
import { normalizeEntity } from './shared'

export default async function getBondedWithdrawals (
  chain: string,
  token: string,
  bonder: string = '',
  lastId: string = '0'
) {
  bonder = bonder.toLowerCase()
  const filters = getFilters(bonder)
  const query = `
    query WithdrawalBonded($token: String, $bonder: String $lastId: ID) {
      withdrawalBondeds(
        where: {
          ${filters}
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
    bonder,
    lastId
  })
  let withdrawals = jsonRes.withdrawalBondeds.map((x: any) => normalizeEntity(x))

  const maxItemsLength = 1000
  if (withdrawals.length === maxItemsLength) {
    lastId = withdrawals[withdrawals.length - 1].id
    withdrawals = withdrawals.concat(await getBondedWithdrawals(
      chain,
      token,
      bonder,
      lastId
    ))
  }

  return withdrawals
}

function getFilters (bonder: string): string {
  let filters: string = `
    id_gt: $lastId
    token: $token
  `

  if (bonder) {
    filters += 'from: $bonder\n'
  }

  return filters
}
