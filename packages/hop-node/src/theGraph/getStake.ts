import makeRequest from './makeRequest'
import { constants } from 'ethers'
import { normalizeEntity } from './shared'

export default async function getStake (
  chain: string,
  token: string,
  bonder: string,
  lastId: string = constants.AddressZero
) {
  bonder = bonder.toLowerCase()
  const query = `
    query Stake($token: String, $bonder: String, $lastId: ID) {
      stakes(
        where: {
          id_gt: $lastId
          account: $bonder
          token: $token
        },
        orderBy: id,
        orderDirection: asc,
        first: 1000
      ) {
        id
        amount
      }
    }
  `
  const jsonRes = await makeRequest(chain, query, {
    token,
    bonder,
    lastId
  })
  let stakes = jsonRes.stakes.map((x: any) => normalizeEntity(x))

  const maxItemsLength = 1000
  if (stakes.length === maxItemsLength) {
    lastId = stakes[stakes.length - 1].id
    stakes = stakes.concat(await getStake(
      chain,
      token,
      bonder,
      lastId
    ))
  }

  return stakes
}
