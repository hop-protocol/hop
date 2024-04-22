import makeRequest from './makeRequest.js'
import { normalizeEntity } from './shared.js'

export default async function getWithdrawals (
  chain: string,
  token: string,
  bonder: string = '',
  lastId: string = '0'
) {
  bonder = bonder.toLowerCase()
  const filters = getFilters(bonder)
  const query = `
    query Withdrew($token: String, $bonder: String $lastId: ID) {
      withdrews(
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
  let withdrawals = jsonRes.withdrews.map((x: any) => normalizeEntity(x))

  const maxItemsLength = 1000
  if (withdrawals.length === maxItemsLength) {
    lastId = withdrawals[withdrawals.length - 1].id
    withdrawals = withdrawals.concat(await getWithdrawals(
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
